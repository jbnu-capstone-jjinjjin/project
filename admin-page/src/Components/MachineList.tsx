import { Container, Table, Button, Space } from '@mantine/core'
import axios from 'axios'
import { useQuery } from 'react-query'

import { MachineData, ErrorResponse } from '../Data/DataType'
import { MachineListProps } from '../Data/PropsType'

export default function MachineList({ onViewDetails }: MachineListProps) {
  const { data, isLoading, error } = useQuery<MachineData, ErrorResponse>('machines', () =>
    axios.get<MachineData>('http://localhost:8080/machines').then(res => res.data))

  if (isLoading) return <Container>로 딩 중 . . .</Container>
  if (error) return <Container>오류 : {error.message}</Container>

  return (
    <Container>
      <Space h="xl" />
      <Table withColumnBorders striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Machine ID</Table.Th>
            <Table.Th>Machine Name</Table.Th>
            <Table.Th>View</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.data.map((machine) => (
            <Table.Tr key={machine.machineId}>
              <Table.Td>{machine.machineId}</Table.Td>
              <Table.Td>{machine.machineName}</Table.Td>
              <Table.Td>
                <Button onClick={() => onViewDetails(machine.machineId)}>상세보기</Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  )
}
