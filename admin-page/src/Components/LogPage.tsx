import { Container, Button, Table, Group, Space } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates' // Import DateTimePicker
import axios from 'axios'
import { useQuery } from 'react-query'
import { useState } from 'react'
import dayjs from 'dayjs'

import 'dayjs/locale/ko'
import { MachineDetail } from '../Data/MachineDataType'

dayjs.locale('ko')

type LogPageProps = {
  machineId: number
  onBack: () => void
};

export default function LogPage({ machineId, onBack }: LogPageProps) {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const fetchData = () => {
    const formattedFrom = dayjs(fromDate).format('YYYY-MM-DDTHH:mm:ss')
    const formattedTo = dayjs(toDate).format('YYYY-MM-DDTHH:mm:ss')
    console.log(`Fetching data from: ${formattedFrom} to: ${formattedTo}`)
    return axios
      .get(
        `http://localhost:8080/machines/${machineId}/metrics?from=${formattedFrom}&to=${formattedTo}`
      )
      .then(res => res.data)
  }

  const { data, isLoading, error, refetch } = useQuery<MachineDetail, Error>(
    ['fetchMachineDetails', machineId, fromDate, toDate],
    fetchData,
    { enabled: false }
  )

  const machineData = data?.data[0]

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
          데이터 가져오기
        </Button>
      </Group>
      {isLoading && <Container>로 딩 중 . . .</Container>}
      {error && <Container>에러: {error.message}</Container>}
      {!machineData && !isLoading && (
        <Container>데이터를 찾을 수 없음 machineId: {machineId}</Container>
      )}
      {machineData && (
        <Table withColumnBorders striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Field</Table.Th>
              <Table.Th>Value</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {[
              ['Metric Type', machineData.metricsType],
              ['Created At', machineData.createdAt],
              ['OS Release', machineData?.data?.os?.release ?? 'N/A'],
              ['Hostname', machineData?.data?.os?.hostname ?? 'N/A'],
              ['Platform', machineData?.data?.os?.platform ?? 'N/A'],
              ['CPU Cores', machineData?.data?.cpu?.cores ?? 'N/A'],
              ['CPU Model', machineData?.data?.cpu?.model ?? 'N/A'],
              ['CPU Speed', `${machineData?.data?.cpu?.speed ?? 'N/A'} MHz`],
              [
                'GPU Models',
                machineData?.data?.gpu
                  ?.map(g => `${g.model} (${g.vram} MB)`)
                  .join(', ') ?? 'N/A'
              ],
              [
                'RAM Total',
                `${machineData?.data?.ram?.total / 1024 / 1024 / 1024 ?? 'N/A'} GB`
              ],
              [
                'Disk Info',
                machineData?.data?.disk
                  ?.map(
                    d =>
                      `${d.fs} - ${d.size / 1024 / 1024 / 1024} GB, ${d.use
                      }% used`
                  )
                  .join(', ') ?? 'N/A'
              ],
              [
                'Network Interfaces',
                machineData?.data?.network
                  ?.map(n => `${n.iface}: ${n.ip4}`)
                  .join(', ') ?? 'N/A'
              ],
              ['Identifier', machineData?.data?.identifier ?? 'N/A']
            ].map((row, index) => (
              <Table.Tr key={index}>
                <Table.Td>{row[0]}</Table.Td>
                <Table.Td>{row[1]}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Container>
  )
}
