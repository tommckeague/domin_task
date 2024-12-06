import { GetServerSideProps, NextPage } from 'next'
import { callExternalFastapiApiGetSerialNumbers } from '../shared/fastapi-api'
import { SerialButton } from '../components/SerialButton'

interface Props {
  serialNumbers?: string[]
  error?: string
}

const Home: NextPage<Props> = ({ serialNumbers, error }) => {
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Error</h1>
          <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Available <span className="text-blue-400">Serial Numbers</span>
        </h1>

        {serialNumbers?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serialNumbers.map((serial) => (
              <div key={serial} className="bg-slate-800 rounded-lg shadow-lg">
                <SerialButton
                  serialNumber={serial}
                  className="w-full p-6 hover:bg-slate-700 rounded-lg transition-colors duration-200"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-6">
            <p className="text-gray-300">No serial numbers available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const { responses, errorMessage } = await callExternalFastapiApiGetSerialNumbers()
    
    if (responses) {
      return { props: { serialNumbers: responses } }
    }
    
    return { props: { error: errorMessage } }
  } catch (error) {
    return { props: { error: 'Failed to fetch serial numbers' } }
  }
}

export default Home