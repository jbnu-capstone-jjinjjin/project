import axios from 'axios'
import { useQuery } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

interface Machine {
  machine_id: number
  machineName: string
}

interface MachineData {
  status: number
  timestamp: string
  message: string
  data: Machine[]
}

interface ErrorResponse {
  message: string
}

export default function Message() {
  const { isLoading, error, data, isFetching } = useQuery<MachineData, ErrorResponse>('repoData', () =>
    axios.get<MachineData>('http://localhost:8080/machines').then(res => res.data))

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>An error has occurred: {error.message}</p>

  return (
    <div>
      <strong>Status: {data?.status}</strong><br />
      <strong>Timestamp: {data?.timestamp}</strong><br />
      <strong>Message: {data?.message}</strong><br />
      <ul>
        {data?.data.map(machine => (
          <li key={machine.machine_id}>
            {machine.machine_id}, {machine.machineName}
          </li>
        ))}
      </ul>
      <div>{isFetching ? 'Updating...' : ''}</div>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}
