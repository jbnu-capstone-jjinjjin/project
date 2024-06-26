import { Container, Space, Button, Group, Table, Accordion, Modal, Pagination } from '@mantine/core'
import { useQuery } from 'react-query'
import { DateTimePicker } from '@mantine/dates'
import { useState, useEffect } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

import { ScreenshotData, ErrorResponse } from '../Data/DataType'

import ScreenImage from './ScreenshotImage'
import 'dayjs/locale/ko'

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export default function ScreenshotModal({ machineId }: { machineId: number }) {
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 3600 * 1000))
  const [toDate, setToDate] = useState(new Date())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [shouldFetch, setShouldFetch] = useState(true)

  const [modalOpened, setModalOpened] = useState(false)
  const toggleModal = () => setModalOpened(o => !o)

  const fetchData = () => {
    const formattedFrom = dayjs(fromDate).format('YYYY-MM-DDTHH:mm:ss')
    const formattedTo = dayjs(toDate).format('YYYY-MM-DDTHH:mm:ss')
    return axios
      .get(`${REACT_APP_API_BASE_URL}/screenshot/${machineId}?from=${formattedFrom}&to=${formattedTo}`)
      .then(res => res.data.data || [])
      .catch(err => Promise.reject(err.response?.data || err.message))
  }

  const { data, isLoading, error, refetch } = useQuery<ScreenshotData[], ErrorResponse>(
    ['fetchScreenshotData', machineId, fromDate, toDate], fetchData, { enabled: shouldFetch }
  )

  useEffect(() => {
    if (shouldFetch) {
      refetch()
      setShouldFetch(false)
    }
  }, [fromDate, toDate, refetch, shouldFetch])

  const paginatedData = data
    ? data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    : []

  return (
    <Container fluid>
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
          {paginatedData.map((screenshot, index) => (
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
      <Space h="xl" />
      <Group justify="center">
        <Pagination
          total={Math.ceil((data ? data.length : 0) / itemsPerPage)}
          value={currentPage}
          onChange={setCurrentPage}
          size="lg"
        />
      </Group>
    </Container>
  )
}
