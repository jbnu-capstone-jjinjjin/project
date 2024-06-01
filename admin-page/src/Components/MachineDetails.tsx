import { Container, Button, Group, Space, Modal, Grid, Paper, Text } from '@mantine/core'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useState, useEffect } from 'react'
import {
  PiGraphicsCardThin, PiCpuThin, PiIdentificationCardThin, PiUserCircleThin, PiDatabaseThin,
  PiClockThin, PiWindowsLogoThin, PiMemoryThin, PiNetworkThin, PiHardDrivesThin
} from 'react-icons/pi'

import { InfoData } from '../Data/DataType'
import { MachineDetailsProps } from '../Data/PropsType'

import Control from './ControlModal'
import LogPage from './LogPage'
import ScreenshotModal from './ScreenshotModal'

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL

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
    () => axios.get(
      `${REACT_APP_API_BASE_URL}/machines/${machineId}/metrics?from=2024-01-01T00:00:00&to=${currentTime}`
    )
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

  return (
    <Container fluid>
      <Space h="xl" />
      <Button onClick={onBack}>Back</Button>
      <Space h="xl" />
      <Grid>
        <Grid.Col span={12}>
          <Paper style={{ height: '35 px', overflow: 'auto' }}>
            <Text ta="right" size='xs'>
              <PiDatabaseThin size={10} />
              METRICSTYPE : {hwInfo.metricsType}
              <br />
              <PiClockThin size={10} />
              CREATED.AT : {hwInfo.createdAt}
              <br />
              <PiIdentificationCardThin size={10} />
              UUID : {hwInfo.data.identifier}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={12}>
          <Paper shadow="xs" ta="center" p="md" withBorder radius="lg" style={{ height: '100px', overflow: 'auto' }}>
            <Text size='lg'>
              <PiUserCircleThin size={50} />
              HOSTNAME : {hwInfo.data.os.hostname}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="xs" p="md" withBorder radius="lg" style={{ height: '300px', overflow: 'auto' }}>
            <Text size='lg'>
              <PiWindowsLogoThin size={40} />
              <ul>
                <li>PLATFORM : {hwInfo.data.os.platform}</li>
                <li>RELEASE : {hwInfo.data.os.release}</li>
              </ul>
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="xs" p="md" withBorder radius="lg" style={{ height: '300px', overflow: 'auto' }}>
            <Text size='lg'>
              <PiCpuThin size={40} />
              <ul>
                <li>MODEL : {hwInfo.data.cpu.model}</li>
                <li>CORES : {hwInfo.data.cpu.cores}</li>
                <li>SPEED : {Math.round(hwInfo.data.cpu.speed / 1024)}GHz</li>
              </ul>
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="xs" p="md" withBorder radius="lg" style={{ height: '300px', overflow: 'auto' }}>
            <Text size='lg'>
              <PiMemoryThin size={40} />
              <ul>
                <li>
                  TOTAL MEMORY : {Math.round(hwInfo.data.ram.total / 1024 / 1024 / 1024)} GB
                </li>
              </ul>
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="xs" p="md" withBorder radius="lg" style={{ height: '300px', overflow: 'auto' }}>
            <Text size='lg'>
              <PiGraphicsCardThin size={40} />
              <ul>
                {hwInfo.data.gpu.map((g, index) => (
                  <li key={index}>
                    {g.model} ({g.vram} MB)
                  </li>
                ))}
              </ul>
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="xs" p="md" withBorder radius="lg" style={{ height: '300px', overflow: 'auto' }}>
            <Text size='lg'>
              <PiHardDrivesThin size={40} />
              <ul>
                {hwInfo.data.disk.map((d, index) => (
                  <li key={index}>
                    {d.fs} - {Math.round(d.size / 1024 / 1024 / 1024)} GB, {d.use}% used
                  </li>
                ))}
              </ul>
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="xs" p="md" withBorder radius="lg" style={{ height: '300px', overflow: 'auto' }}>
            <Text size='lg'>
              <PiNetworkThin size={40} />
              <ul>
                {hwInfo.data.network.map(n => (
                  <li key={n.iface}>
                    {n.iface}: {n.ip4 || 'N/A'}
                    <br />(MAC: {n.mac || 'N/A'})
                  </li>
                ))}
              </ul>
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>
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
