import axios, { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import { Container, Button, TextInput, Group, Select } from '@mantine/core'
import { useState } from 'react'

import { CommandData, ResponseData } from '../Data/DataType'

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

  const commands = [
    { value: 'KILL_PROCESS', label: 'KILL_PROCESS' },
    { value: 'RESTART_PROCESS', label: 'RESTART_PROCESS' },
    { value: 'TAKE_SCREENSHOT', label: 'TAKE_SCREENSHOT' }
  ]

  return (
    <Container>
      <h3>Control Page for Machine {machineId}</h3>
      <Select
        withCheckIcon={false}
        label="Command"
        placeholder="명령어를 선택해주세요."
        data={commands}
        value={command}
        onChange={(value) => value ? setCommand(value) : null}
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
