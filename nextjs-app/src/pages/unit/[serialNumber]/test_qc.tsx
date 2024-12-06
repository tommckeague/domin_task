import React from 'react';
import DataGraph from '../../../components/DataGraph';
import { callExternalFastapiApiGetSensorData, type SensorDataPoint } from '../../../shared/fastapi-api';
import { GetServerSideProps } from 'next';

interface DashboardPageProps {
  sensorData0: SensorDataPoint[];
  sensorData1: SensorDataPoint[];
  sensorData2: SensorDataPoint[];
  sensorData3: SensorDataPoint[];
  sensorData4: SensorDataPoint[];
  sensorData5: SensorDataPoint[];
  sensorData6: SensorDataPoint[];
  sensorData7: SensorDataPoint[];
  serialNumber: string;
  error?: string;
}

export default function DashboardPage({
  sensorData0,
  sensorData1,
  sensorData2,
  sensorData3,
  sensorData4,
  sensorData5,
  sensorData6,
  sensorData7,
  serialNumber,
  error
}: DashboardPageProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Error Loading Dashboard</h1>
          <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>
        </div>
      </div>
    );
  }

  const sensors = [
    { data: sensorData0, title: "Flow Meter 1", label: "Flow rate" },
    { data: sensorData1, title: "Flow Meter 2", label: "Flow rate" },
    { data: sensorData2, title: "Temperature 1", label: "Temperature" },
    { data: sensorData3, title: "Pressure Meter 1", label: "Pressure" },
    { data: sensorData4, title: "Pressure Meter 2", label: "Pressure" },
    { data: sensorData5, title: "Pressure Meter 3", label: "Pressure" },
    { data: sensorData6, title: "Pressure Meter 4", label: "Pressure" },
    { data: sensorData7, title: "Linear Encoder", label: "Angle" }
  ];

  const hasData = sensors.some(sensor => sensor.data && sensor.data.length > 0);

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">
            Serial Number: <span className="text-blue-400">{serialNumber}</span>
          </h1>
          <p className="text-gray-300">No sensor data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Serial Number: <span className="text-blue-400">{serialNumber}</span>
        </h1>
        
        <div className="grid grid-cols-1 gap-6">
          {sensors.map((sensor, index) => (
            sensor.data && sensor.data.length > 0 && (
              <div key={index} className="bg-slate-800 rounded-lg p-6 shadow-lg">
                <DataGraph 
                  data={sensor.data}
                  xKey="timestamp"
                  yKey="value"
                  title={sensor.title}
                  xAxisLabel="Time (s)"
                  yAxisLabel={`${sensor.label} (${sensor.data[0]?.unit || ''})`}
                />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<DashboardPageProps> = async (context) => {
  try {
    const { params } = context;
    const { test_id } = context.query;
    
    if (!test_id || typeof test_id !== 'string') {
      throw new Error('Test ID is required');
    }

    const serialNumber = params?.serialNumber as string;
    const sensors_to_pull = [
      'flow_meter_1',
      'flow_meter_2',
      'temperature',
      'pressure_meter_1',
      'pressure_meter_2',
      'pressure_meter_3',
      'pressure_meter_4',
      'linear_encoder'
    ];

    const sensorDataPromises = sensors_to_pull.map(sensor => 
      callExternalFastapiApiGetSensorData('test_qc', test_id, sensor)
    );

    const [
      sensorData0,
      sensorData1,
      sensorData2,
      sensorData3,
      sensorData4,
      sensorData5,
      sensorData6,
      sensorData7
    ] = await Promise.all(sensorDataPromises);

    return {
      props: {
        sensorData0,
        sensorData1,
        sensorData2,
        sensorData3,
        sensorData4,
        sensorData5,
        sensorData6,
        sensorData7,
        serialNumber,
      },
    };
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return {
      props: {
        sensorData0: [],
        sensorData1: [],
        sensorData2: [],
        sensorData3: [],
        sensorData4: [],
        sensorData5: [],
        sensorData6: [],
        sensorData7: [],
        serialNumber: '',
        error: 'Failed to load sensor data. Please try again later.'
      },
    };
  }
};