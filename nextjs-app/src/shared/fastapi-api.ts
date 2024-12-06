export type ApiSerialNumberResponse = {
  serial_numbers: string[]
}

type SerialNumberApiCallResponse = {
  errorMessage: string
  responses?: string[]
}

export const callExternalFastapiApiGetSerialNumbers = async (): Promise<SerialNumberApiCallResponse> => {
  try {
    const response = await fetch(`${process.env.FASTAPI_API_URL}/get_serial_numbers`);
    if (!response.ok) {
      return { 
        errorMessage: `API returned ${response.status}: ${response.statusText}` 
      };
    }
    const data: ApiSerialNumberResponse = await response.json();
    console.log(data)
    return { responses: data.serial_numbers, errorMessage: '' };
  } catch (error) {
    return { 
      errorMessage: 'Failed to fetch serial numbers' 
    };
  }
}


export type TestOption = {
  test_type: string;
  test_id: string;
  test_start_timestamp: string;
  test_end_timestamp: string;
  notes: string;
}
export type ApiTestOptionsResponse = TestOption[];

type TestOptionsApiCallResponse = {
  errorMessage: string;
  responses?: TestOption[];
}

export const callExternalFastapiApiGetTestOptionsForSerialNumber = async (serialNumber: string): Promise<TestOptionsApiCallResponse> => {
  try {
    const response = await fetch(`${process.env.FASTAPI_API_URL}/get_test_selection_options_for_serial_number`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serial_number: serialNumber })
    });

    if (!response.ok) {
      return { errorMessage: `API returned ${response.status}: ${response.statusText}` };
    }

    const data: ApiTestOptionsResponse = await response.json();
    return { responses: data, errorMessage: '' };
  } catch (error) {
    return { errorMessage: 'Failed to fetch test options' };
  }
}


export type SensorDataPoint = {
  timestamp: number;
  value: number;
  unit: string;
  datapoint_id: number;
}

export type ApiSensorDataResponse = SensorDataPoint[];

type SensorDataApiCallResponse = {
  errorMessage: string;
  responses?: SensorDataPoint[];
}

export const callExternalFastapiApiGetSensorData = async (
  testTable: string,
  testId: number,
  sensorType: string
): Promise<SensorDataApiCallResponse> => {
  try {
    const response = await fetch(`${process.env.FASTAPI_API_URL}/get_sensor_data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        test_table: testTable,
        test_id: testId,
        sensor_type: sensorType
      })
    });

    if (!response.ok) {
      return { 
        errorMessage: `API returned ${response.status}: ${response.statusText}` 
      };
    }

    const data: ApiSensorDataResponse = await response.json();
    return data;
  } catch (error) {
    return { 
      errorMessage: 'Failed to fetch sensor data' 
    };
  }
}
