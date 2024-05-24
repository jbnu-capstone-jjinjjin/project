import axios, { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import { Container, Button, TextInput, Group } from '@mantine/core'
import { useState } from 'react'

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
  const [command, setCommand] = useState('')
  const [args, setArgs] = useState('')

  const controlMutation = useMutation<ResponseData, AxiosError<ResponseData>, CommandData>(controlDaemon, {
    onSuccess: (data) => {
      console.log('성공:', data.message)
    },
    onError: (error: AxiosError<ResponseData>) => {
      console.error('오류:', error.response?.data.message || error.message)
    }
  })

  const handleControl = () => {
    controlMutation.mutate({
      machineId,
      control: {
        command,
        args: args.split(' '),
      }
    })
  }

  return (
    <Container>
      <h3>Control Page for Machine {machineId}</h3>
      <TextInput
        label="Command"
        placeholder="명령어를 입력해주세요. ex) kill, screenshot"
        value={command}
        onChange={(event) => setCommand(event.currentTarget.value)}
      />
      <TextInput
        label="Arguments"
        placeholder="인자를 입력해주세요. (띄어쓰기로 구분)"
        value={args}
        onChange={(event) => setArgs(event.currentTarget.value)}
      />
      <Group mt="md">
        <Button onClick={handleControl} disabled={!command}>Send Command</Button>
      </Group>
      {controlMutation.isLoading && <p>Command 전송 중...</p>}
      {controlMutation.isError &&
        <p>에러: {controlMutation.error?.response?.data.message || controlMutation.error?.message}</p>}
      {controlMutation.isSuccess && <p>Command 전송 완료</p>}
    </Container>
  )
}
