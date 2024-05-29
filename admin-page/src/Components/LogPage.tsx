import { Container, Button, Group, Space, Accordion, Table, Text } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useState } from 'react'
import dayjs from 'dayjs'

import 'dayjs/locale/ko'
import { InfoData, HwInfo, ResourceInfo, SDKInfo } from '../Data/DataType'
import { LogPageProps } from '../Data/PropsType'

dayjs.locale('ko')

export default function LogPage({ machineId, onBack }: LogPageProps) {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const fetchData = () => {
    const formattedFrom = dayjs(fromDate).format('YYYY-MM-DDTHH:mm:ss')
    const formattedTo = dayjs(toDate).format('YYYY-MM-DDTHH:mm:ss')
    return axios.get(`http://localhost:8080/machines/${machineId}/metrics?from=${formattedFrom}&to=${formattedTo}`)
      .then(res => res.data.data) // Assuming the backend response structure accommodates this path
      .catch(err => Promise.reject(err.response?.data || err.message))
  }

  const { data, isLoading, refetch } = useQuery<InfoData[]>(
    'fetchMachineDetails',
    fetchData,
    { enabled: false }
  )

  const renderDetails = (detail: InfoData) => {
    switch (detail.metricsType) {
      case 'HW_INFO': {
        const hw = detail.data as HwInfo
        return renderTable([
          ['OS Release', hw.os.release],
          ['Hostname', hw.os.hostname],
          ['Platform', hw.os.platform],
          ['CPU Cores', hw.cpu.cores.toString()],
          ['CPU Model', hw.cpu.model],
          ['CPU Speed', `${hw.cpu.speed} MHz`],
          ['GPU Models', hw.gpu ? hw.gpu.map(g => `${g.model} (${g.vram} MB)`).join(', ') : 'N/A'],
          ['RAM Total', `${hw.ram.total / 1024 / 1024 / 1024} GB`],
          ['Disk Info', hw.disk
            ? hw.disk.map(
              d => `${d.fs} - ${d.size / 1024 / 1024 / 1024} GB, ${d.use}% used`
            ).join(', ')
            : 'N/A'],
          ['Network Interfaces', hw.network
            ? hw.network.map(
              n => `${n.iface}: ${n.ip4} (${n.mac})`
            ).join(', ')
            : 'N/A'],
          ['Identifier', hw.identifier]
        ])
      }
      case 'RESOURCE_INFO': {
        const resource = detail.data as ResourceInfo
        return renderTable([
          ['Top CPU Process', resource.topCpu
            ? resource.topCpu.map(
              cpu => `${cpu.name} (${cpu.cpu}%)`
            ).join(', ')
            : 'N/A'],
          ['Top Memory Process', resource.topMemory
            ? resource.topMemory.map(
              mem => `${mem.name} (${mem.memory}MB)`
            ).join(', ')
            : 'N/A']
        ])
      }
      case 'SDK_INFO': {
        const sdk = detail.data as SDKInfo
        return renderTable([
          ['.NET Version', sdk.dotnet || 'N/A'],
          ['Java Version', sdk.java || 'N/A']
        ])
      }
      default:
        return <Text>Data type is not recognized.</Text>
    }
  }

  const renderTable = (rows: [string, string][]) => (
    <Table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            <td>{row[0]}</td>
            <td>{row[1]}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )

  return (
    <Container fluid>
      <Space h="xl" />
      <Button onClick={onBack}>Back</Button>
      <h3>Log Page for Machine {machineId}</h3>
      <Group>
        <DateTimePicker
          value={fromDate}
          onChange={date => setFromDate(date as Date)}
          placeholder="Select start date and time"
          withSeconds
          locale="ko"
        />
        <DateTimePicker
          value={toDate}
          onChange={date => setToDate(date as Date)}
          placeholder="Select end date and time"
          withSeconds
          locale="ko"
        />
        <Button onClick={() => refetch()} size="sm">
          Fetch Data
        </Button>
      </Group>
      <Space h="xl" />
      {isLoading && <div>Loading...</div>}
      {!data && !isLoading && <div>No data available for machineId: {machineId}</div>}
      {data && (
        <Accordion variant="separated" radius="xs">
          {data.map((detail, index) => (
            <Accordion.Item key={index} value={`item-${index}`}>
              <Accordion.Control>
                Metric Type: {detail.metricsType}
                <br />
                Created At: {detail.createdAt}
              </Accordion.Control>
              <Accordion.Panel>
                {renderDetails(detail)}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  )
}
