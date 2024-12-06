from pydantic import BaseModel

class SerialNumber(BaseModel):
    serial_number: str


class TestData(BaseModel):
    test_table: str
    test_id: int
    sensor_type: str
