import { GetServerSideProps, NextPage } from 'next';
import { callExternalFastapiApiGetTestOptionsForSerialNumber, TestOption } from '../../../shared/fastapi-api';
import { DetailTable } from '../../../components/DetailTable';

interface SerialDetailsProps {
  serialNumber: string;
  testOptions?: TestOption[];
  error?: string;
}

const SerialDetails: NextPage<SerialDetailsProps> = ({
  serialNumber,
  testOptions,
  error
}) => {
  if (error) {
    return <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>
  }

  const testColumns = [
    { key: 'test_type', label: 'Test Type' },
    { key: 'test_id', label: 'Test ID' },
    { key: 'test_start_timestamp', label: 'Start Time' },
    { key: 'test_end_timestamp', label: 'End Time' },
    { key: 'notes', label: 'Notes' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Serial Number: <span className="text-blue-400">{serialNumber}</span>
        </h1>
        {testOptions && <DetailTable title="Test History" columns={testColumns} data={testOptions} />}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<SerialDetailsProps> = async ({ params }) => {
  const serialNumber = params?.serialNumber as string;
  const { responses, errorMessage } = await callExternalFastapiApiGetTestOptionsForSerialNumber(serialNumber);
  
  if (errorMessage) {
    return { props: { serialNumber, error: errorMessage } };
  }
  
  return { props: { serialNumber, testOptions: responses } };
};

export default SerialDetails;