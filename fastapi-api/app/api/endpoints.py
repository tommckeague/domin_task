from fastapi import APIRouter, File, UploadFile, Request, HTTPException
from api.service import run_query, get_query_engine
from api.models import SerialNumber, TestData
import re
import ujson as json
import datetime
import hashlib
from api.queries.loader import QueryConfig

router = APIRouter()
config = QueryConfig()

@router.get("/")
def read_root():
    return {"Hello": "World"}

@router.get("/connectdb")
async def connectdb():
    try:
        query = config.properties['CONNECT_TO_DBTEST']
        response = run_query(query)
    except Exception as exp:
        raise HTTPException(status_code=500,
                            detail={"status": "error", "message": "Oops, something went wrong. Try again in a moment."})

    return json.loads(response)

@router.get("/get_serial_numbers")
async def get_serial_numbers():
    try:
        query = config.properties['GET_SERIAL_NUMBERS_QUERY']
        results = run_query(query)
        parsed_results = json.loads(results)
        return {
            "serial_numbers": [sn["serial_number"] for sn in parsed_results]
        }
    except Exception as exp:
        raise HTTPException(status_code=500,
                            detail={"status": "error", "message": "Oops, something went wrong. Try again in a moment."})

@router.post("/get_test_selection_options_for_serial_number", status_code=200)
async def get_test_selection_options_for_serial_number(request: SerialNumber):
    try:
        query = config.properties['GET_TEST_SELECTION_OPTIONS_FOR_SERIAL_NUMBER_QUERY'].format(
            serial_number=request.serial_number
        )
        response = run_query(query)
        raw_data = json.loads(response)
        
        formatted_response = [
            {
                "test_type": row["test_type"],
                "test_id": row["test_id"],
                "test_start_timestamp": row["test_start_timestamp"],
                "test_end_timestamp": row["test_end_timestamp"],
                "notes": row["notes"] if "notes" in row else ""
            }
            for row in raw_data
        ]
        return formatted_response
        
    except Exception as exp:
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "message": "Oops, something went wrong. Try again in a moment."}
        )

@router.post("/get_sensor_data", status_code=200)
async def get_sensor_data(request: TestData):
    try:
        query = config.properties['GET_TEST_DATA_QUERY'].format(
            test_table=request.test_table,
            test_id=request.test_id,
            sensor_type=request.sensor_type
        )
        print(query)
        response = run_query(query)
        data = json.loads(response)
        print(data[200])
        print(data[201])
        return [{
            "timestamp": row["timestamp"],
            "value": float(row["value"]),
            "unit": row["unit"],
            "datapoint_id": row["datapoint_id"]
        } for row in data]
    except Exception as exp:
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "message": "Failed to fetch sensor data"}
        )



# Template for db queries
# @router.get("/")
# async def read_root():
#     return {"Hello": "World"}

