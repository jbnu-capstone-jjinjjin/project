import { Container, Button, Table, Group, Space, Modal } from '@mantine/core'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useState, useEffect } from 'react'

import { InfoData } from '../Data/DataType'
import { MachineDetailsProps } from '../Data/PropsType'

import Control from './ControlModal'
import LogPage from './LogPage'
import ScreenshotModal from './ScreenshotModal'

export default function MachineDetails({ machineId, onBack }: MachineDetailsProps) {
  const [viewLogPage, setViewLogPage] = useState(false)
  const [isControlModalOpen, setControlModalOpen] = useState(false)
  const [isScreenshotModalOpen, setScreenshotModalOpen] = useState(false)

  const getKoreanTime = () => {
    const now = new Date()
    const kstOffset = 9 * 60 * 60 * 1000
    const kstTime = new Date(now.getTime() + kstOffset)
    return kstTime.toISOString()
  }

  const [currentTime, setCurrentTime] = useState(getKoreanTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getKoreanTime())
    }, 1000 * 60)

    return () => clearInterval(interval)
  }, [])

  const { data, isLoading, error } = useQuery<InfoData, Error>(
    ['fetchMachineDetails', machineId],
    () => axios.get(`http://localhost:8080/machines/${machineId}/metrics?from=2024-01-01T00:00:00&to=${currentTime}`)
      .then(res => res.data),
    { enabled: !!machineId }
  )

  if (viewLogPage) {
    return <LogPage machineId={machineId} onBack={() => setViewLogPage(false)} />
  }
  if (isLoading) return <Container>로 딩 중 . . .</Container>
  if (error) return <Container>오류: {error.message}</Container>
  if (!data || !Array.isArray(data.data)) return <Container>데이터를 찾을 수 없음 machineId: {machineId}</Container>

  const hwInfo = data.data.filter(d => d.metricsType === 'HW_INFO')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

  if (!hwInfo) return <Container>HW_INFO 데이터를 찾을 수 없음 machineId: {machineId}</Container>

  const rows = [
    ['Metric Type', hwInfo.metricsType],
    ['Created At', hwInfo.createdAt],
    ['OS Release', hwInfo.data.os.release ?? 'N/A'],
    ['Hostname', hwInfo.data.os.hostname ?? 'N/A'],
    ['Platform', hwInfo.data.os.platform ?? 'N/A'],
    ['CPU Cores', hwInfo.data.cpu.cores ?? 'N/A'],
    ['CPU Model', hwInfo.data.cpu.model ?? 'N/A'],
    ['CPU Speed', `${hwInfo.data.cpu.speed ?? 'N/A'} MHz`],
    ['GPU Models', hwInfo.data.gpu.map(g => `${g.model} (${g.vram} MB)`).join(', ') ?? 'N/A'],
    ['RAM Total', `${Math.round(hwInfo.data.ram.total / 1024 / 1024 / 1024) ?? 'N/A'} GB`],
    ['Disk Info', hwInfo.data.disk.map(
      d => `${d.fs} - ${Math.round(d.size / 1024 / 1024 / 1024)} GB, ${d.use}% used`
    ).join(', ') ?? 'N/A'],
    ['Network Interfaces', hwInfo.data.network.map(n => `${n.iface}: ${n.ip4}`).join(', ') ?? 'N/A'],
    ['Identifier', hwInfo.data.identifier ?? 'N/A']
  ]

  return (
    <Container fluid>
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
