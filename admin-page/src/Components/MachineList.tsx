import { Container, Table, Button } from '@mantine/core'
import axios from 'axios'
import { useQuery } from 'react-query'

import { MachineData, ErrorResponse, MachineListProps } from '../Data/MachineDataType'

export default function MachineList({ onViewDetails }: MachineListProps) {
  const { data, isLoading, error } = useQuery<MachineData, ErrorResponse>('machines', () =>
    axios.get<MachineData>('http://localhost:8080/machines').then(res => res.data))

  if (isLoading) return <Container>로 딩 중 . . .</Container>
  if (error) return <Container>오류 : {error.message}</Container>

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>Machine ID</th>
          <th>Machine Name</th>
          <th>View</th>
        </tr>
      </thead>
      <tbody>
        {data?.data.map((machine) => (
          <tr key={machine.machine_id}>
            <td>{machine.machine_id}</td>
            <td>{machine.machineName}</td>
            <td>
              <Button onClick={() => onViewDetails(machine.machine_id)}>상세보기</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
