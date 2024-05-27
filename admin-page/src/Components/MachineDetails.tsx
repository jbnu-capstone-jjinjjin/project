import { Container, Button, Table, Group, Space, Modal } from '@mantine/core'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useState } from 'react'

import { MachineDetail } from '../Data/DataType'
import { MachineDetailsProps } from '../Data/PropsType'

import Control from './ControlModal'
import LogPage from './LogPage'
import ScreenshotModal from './ScreenshotModal'

export default function MachineDetails({ machineId, onBack }: MachineDetailsProps) {
  const [viewLogPage, setViewLogPage] = useState(false)
  const [isControlModalOpen, setControlModalOpen] = useState(false)
  const [isScreenshotModalOpen, setScreenshotModalOpen] = useState(false)

  const { data, isLoading, error } = useQuery<MachineDetail, Error>(
    ['fetchMachineDetails', machineId],
    () => axios.get(`http://localhost:8080/machines/${machineId}/metrics`)
      .then(res => res.data),
    { enabled: !!machineId }
  )
  if (isLoading) return <Container>로 딩 중 . . .</Container>
  if (error) return <Container>오류: {error.message}</Container>
  if (!data) return <Container>데이터를 찾을 수 없음 machindId: {machineId}</Container>

  console.log(data)
  const machineData = data.data[0]
  if (!machineData) return <Container>데이터를 찾을 수 없음 machindId: {machineId}</Container>

  if (viewLogPage) {
    return <LogPage machineId={machineId} onBack={() => setViewLogPage(false)} />
  }
  const rows = [
    ['Metric Type', machineData.metricsType],
    ['Created At', machineData.createdAt],
    ['OS Release', machineData?.data?.os?.release ?? 'N/A'],
    ['Hostname', machineData?.data?.os?.hostname ?? 'N/A'],
    ['Platform', machineData?.data?.os?.platform ?? 'N/A'],
    ['CPU Cores', machineData?.data?.cpu?.cores ?? 'N/A'],
    ['CPU Model', machineData?.data?.cpu?.model ?? 'N/A'],
    ['CPU Speed', `${machineData?.data?.cpu?.speed ?? 'N/A'} MHz`],
    ['GPU Models', machineData?.data?.gpu?.map(g => `${g.model} (${g.vram} MB)`).join(', ') ?? 'N/A'],
    ['RAM Total', `${machineData?.data?.ram?.total / 1024 / 1024 / 1024 ?? 'N/A'} GB`],
    ['Disk Info', machineData?.data?.disk?.map(
      d => `${d.fs} - ${d.size / 1024 / 1024 / 1024} GB, ${d.use}% used`
    ).join(', ') ?? 'N/A'],
    ['Network Interfaces', machineData?.data?.network?.map(n => `${n.iface}: ${n.ip4}`).join(', ') ?? 'N/A'],
    ['Identifier', machineData?.data?.identifier ?? 'N/A']
  ]

  return (
    <Container>
      <Space h="xl" />
      <Button onClick={onBack}>Back</Button>
      <Space h="xl" />
      <Table withColumnBorders striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Field</Table.Th>
            <Table.Th>Value</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row, index) => (
            <Table.Tr key={index}>
              <Table.Td>{row[0]}</Table.Td>
              <Table.Td>{row[1]}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Space h="xl" />
      <Group justify="center" gap="xl" grow>
        <Button onClick={() => setViewLogPage(true)}>View Logs</Button>
        <Button onClick={() => setControlModalOpen(true)}>Command</Button>
        <Button onClick={() => setScreenshotModalOpen(true)}>Screenshot</Button>
      </Group>
      <Modal
        opened={isControlModalOpen}
        onClose={() => setControlModalOpen(false)}
        title="Control Page"
        size="lg"
      >
        <Control machineId={machineId} />
      </Modal>
      <Modal
        opened={isScreenshotModalOpen}
        onClose={() => setScreenshotModalOpen(false)}
        title="Screenshot Page"
        size="lg"
      >
        <ScreenshotModal machineId={machineId} />
      </Modal>
    </Container >
  )
}
