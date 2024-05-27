import { Container, Space, Button, Group, Table, Accordion, Modal } from '@mantine/core'
import { useQuery } from 'react-query'
import { DateTimePicker } from '@mantine/dates'
import { useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

import { ScreenshotData, ErrorResponse } from '../Data/DataType'

import ScreenImage from './ScreenshotImage'
import 'dayjs/locale/ko'

export default function ScreenshotModal({ machineId }: { machineId: number }) {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const [modalOpened, setModalOpened] = useState(false)
  const toggleModal = () => setModalOpened(o => !o)

  const fetchData = () => {
    const formattedFrom = dayjs(fromDate).format('YYYY-MM-DDTHH:mm:ss')
    const formattedTo = dayjs(toDate).format('YYYY-MM-DDTHH:mm:ss')
    console.log(`Fetching data from: ${formattedFrom} to: ${formattedTo}`)
    return axios
      .get(`http://localhost:8080/screenshot/${machineId}?from=${formattedFrom}&to=${formattedTo}`)
      .then(res => res.data.data || [])
      .catch(err => Promise.reject(err.response?.data || err.message))
  }

  const { data, isLoading, error, refetch } = useQuery<ScreenshotData[], ErrorResponse>(
    ['fetchScreenshotData', machineId, fromDate, toDate],
    fetchData,
    { enabled: false }
  )

  return (
    <Container>
      <Space h="xl" />
      <h3>Screenshot Page for Machine {machineId}</h3>
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
      <Space h="xl" />
      {isLoading && <Container>Loading...</Container>}
      {error && <Container>Error: {error.message}</Container>}
      {!data && !isLoading && <Container>No data found for machineId: {machineId}</Container>}
      {data && (
        <Accordion variant="separated" radius="xs">
          {data.map((screenshot, index) => (
            <Accordion.Item key={index} value={`item-${index}`}>
              <Accordion.Control>
                Created At: {screenshot.createdAt}
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
                    <Table.Tr>
                      <Table.Td>Machine ID</Table.Td>
                      <Table.Td>{screenshot.machineId}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Screenshot ID</Table.Td>
                      <Table.Td>{screenshot.screenshotId}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Image Name</Table.Td>
                      <Table.Td>{screenshot.imageName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Actions</Table.Td>
                      <Table.Td>
                        <Button onClick={toggleModal}>View Screenshot</Button>
                        <Modal
                          opened={modalOpened}
                          onClose={toggleModal}
                          title="Screenshot"
                          size="100rem"
                        >
                          <ScreenImage screenshotId={screenshot.screenshotId} />
                        </Modal>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  )
}
