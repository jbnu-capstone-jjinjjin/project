import axios, { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import { Container, Button } from '@mantine/core'

interface CommandData {
  machineId: number
  control: {
    command: string
    args: string[]
  }
}

interface ResponseData {
  message: string
}

const controlDaemon = async (commandData: CommandData): Promise<ResponseData> => {
  const response = await axios.post<ResponseData>('http://localhost:8080/daemon/control', commandData)
  return response.data
}

export default function Control({ machineId }: { machineId: number }) {
  const controlMutation = useMutation<ResponseData, AxiosError<ResponseData>, CommandData>(controlDaemon, {
    onSuccess: (data) => {
      console.log('성공:', data.message)
    },
    onError: (error: AxiosError<ResponseData>) => {
      console.error('오류:', error.response?.data.message || error.message)
    }
  })

  const handleControl = (machineId: number, command: string, args: string[]) => {
    controlMutation.mutate({
      machineId,
      control: {
        command,
        args
      }
    })
  }

  return (
    <Container>
      <h3>Control Page for Machine {machineId}</h3>
      <Button onClick={() => handleControl(machineId, 'kill', ['screenshot'])}>Send Command</Button>
      {controlMutation.isLoading && <p>Command 전송 중</p>}
      {controlMutation.isError &&
        <p>에러: {controlMutation.error?.response?.data.message || controlMutation.error?.message}</p>}
      {controlMutation.isSuccess && <p>Command 전송 완료</p>}
    </Container>
  )
}
