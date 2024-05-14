import { Container, Button, Table } from '@mantine/core'
import axios from 'axios'
import { useQuery } from 'react-query'

import { MachineDetail, MachineDetailsProps } from '../Data/MachineDataType'

export default function MachineDetails({ machineId, onBack }: MachineDetailsProps) {
  const { data, isLoading, error } = useQuery<MachineDetail, Error>(
    ['fetchMachineDetails', machineId],
    () => axios.get(`http://localhost:8080/machines/${machineId}/metrics`).then(res => res.data),
    { enabled: !!machineId }
  )
  if (isLoading) return <Container>로 딩 중 . . .</Container>
  if (error) return <Container>오류: {error.message}</Container>
  if (!data) return <Container>데이터를 찾을 수 없음 machindId: {machineId}</Container>

  const machineData = data.data[0]

  const rows = [
    ['Metric Type', machineData.metricType],
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
      <Button onClick={onBack} style={{ marginTop: '20px', marginBottom: '20px' }}>Back</Button>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button style={{ marginTop: '20px' }}>Request Screenshot</Button>
      <Button style={{ marginLeft: '10px' }}>View Logs</Button>
      <Button style={{ marginLeft: '10px' }}>Send Message</Button>
    </Container>
  )
}
