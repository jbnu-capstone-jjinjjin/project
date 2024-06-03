import { Container, Table, Button, Space, Pagination, Group } from '@mantine/core'
import { useState } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'

import { MachineData, ErrorResponse } from '../Data/DataType'
import { MachineListProps } from '../Data/PropsType'

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export default function MachineList({ onViewDetails }: MachineListProps) {
  const [activePage, setActivePage] = useState(1)
  const itemsPerPage = 10

  const { data, isLoading, error } = useQuery<MachineData, ErrorResponse>('machines', () =>
    axios.get<MachineData>(`${REACT_APP_API_BASE_URL}/machines`).then(res => res.data))

  if (isLoading) return <Container>로 딩 중 . . .</Container>
  if (error) return <Container>오류 : {error.message}</Container>
  if (!data || !data.data) return <Container>데이터를 찾을 수 없음</Container>

  const paginatedData = data!.data!.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  )

  return (
    <Container fluid>
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
          {paginatedData.map((machine) => (
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
      <Space h="xl" />
      <Group justify="center">
        <Pagination
          total={Math.ceil(data.data.length / itemsPerPage)}
          value={activePage}
          onChange={setActivePage}
          size="lg"
        />
      </Group>
    </Container>
  )
}
