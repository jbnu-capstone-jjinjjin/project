import { Container, Button, Table, Group, Space, Accordion } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useState } from 'react'
import dayjs from 'dayjs'

import 'dayjs/locale/ko'
import { MachineDetail } from '../Data/DataType'
import { LogPageProps } from '../Data/PropsType'

dayjs.locale('ko')

export default function LogPage({ machineId, onBack }: LogPageProps) {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const fetchData = () => {
    const formattedFrom = dayjs(fromDate).format('YYYY-MM-DDTHH:mm:ss')
    const formattedTo = dayjs(toDate).format('YYYY-MM-DDTHH:mm:ss')
    return axios.get(`http://localhost:8080/machines/${machineId}/metrics?from=${formattedFrom}&to=${formattedTo}`)
      .then(res => {
        return res.data.data.filter((
          item: MachineDetail
        ) => item.metricsType === 'RESOURCE_INFO' || item.metricsType === 'SDK_INFO')
      })
      .catch(err => Promise.reject(err.response?.data || err.message))
  }

  const { data, isLoading, error, refetch } = useQuery<MachineDetail[], Error>(
    ['fetchMachineDetails', machineId, fromDate, toDate],
    fetchData,
    { enabled: false }
  )

  return (
    <Container>
      <Space h="xl" />
      <Button onClick={onBack}>Back</Button>
      <h3>Log Page for Machine {machineId}</h3>
      <Group>
        <DateTimePicker
          value={fromDate}
          onChange={(date) => setFromDate(date as Date)}
          placeholder="Select start date and time"
          withSeconds
          locale="ko"
        />
        <DateTimePicker
          value={toDate}
          onChange={(date) => setToDate(date as Date)}
          placeholder="Select end date and time"
          withSeconds
          locale="ko"
        />
        <Button onClick={() => refetch()} size="sm">
          Fetch Data
        </Button>
      </Group>
      <Space h="xl" />
      {isLoading && <Container>Loading...</Container>}
      {error && <Container>Error: {error.message}</Container>}
      {!data && !isLoading && <Container>No data available for machineId: {machineId}</Container>}
      {data && (
        <Accordion variant="separated" radius="xs">
          {data.map((machineDetail, index) => {
            const rows = [
              ['Metric Type', machineDetail.metricsType],
              ['Created At', machineDetail.createdAt],
              ['OS Release', machineDetail.data.os.release],
              ['Hostname', machineDetail.data.os.hostname],
              ['Platform', machineDetail.data.os.platform],
              ['CPU Cores', machineDetail.data.cpu.cores],
              ['CPU Model', machineDetail.data.cpu.model],
              ['CPU Speed', `${machineDetail.data.cpu.speed} MHz`],
              ['GPU Models', machineDetail.data.gpu.map(g => `${g.model} (${g.vram} MB)`).join(', ')],
              ['RAM Total', `${machineDetail.data.ram.total / 1024 / 1024 / 1024} GB`],
              ['Disk Info', machineDetail.data.disk.map(
                d => `${d.fs} - ${d.size / 1024 / 1024 / 1024} GB, ${d.use}% used`
              ).join(', ')],
              ['Network Interfaces', machineDetail.data.network.map(
                n => `${n.iface}: ${n.ip4} (${n.mac})`
              ).join(', ')],
              ['Identifier', machineDetail.data.identifier]
            ]
            return (
              <Accordion.Item key={index} value={`item-${index}`}>
                <Accordion.Control>
                  Metric Type: {machineDetail.metricsType}
                  <br />
                  Created At: {machineDetail.createdAt}
                </Accordion.Control>
                <Accordion.Panel>
                  <Table withColumnBorders striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Field</Table.Th>
                        <Table.Th>Value</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {rows.map((row, idx) => (
                        <Table.Tr key={idx}>
                          <Table.Td>{row[0]}</Table.Td>
                          <Table.Td>{row[1]}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Accordion.Panel>
              </Accordion.Item>
            )
          })}
        </Accordion>
      )}
    </Container>
  )
}
