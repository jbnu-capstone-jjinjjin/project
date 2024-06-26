import { Container, Loader, Text } from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export default function ScreenImage({ screenshotId }: { screenshotId: number }) {
  const [imageData, setImageData] = useState<{ imageName: string; imageData: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setIsLoading(true)
    axios.get(`${REACT_APP_API_BASE_URL}/screenshot/${screenshotId}/detail`)
      .then(response => {
        setImageData(response.data.data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error fetching image data:', err)
        setError('Failed to load image: ' + (err.response?.data?.message || err.message))
        setIsLoading(false)
      })
  }, [screenshotId])

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <Text>{error}</Text>
  }

  if (!imageData) {
    return <Container>No Image Data Available</Container>
  }

  return (
    <Container fluid>
      <img
        src={`data:image/jpeg;base64,${imageData.imageData}`}
        alt={imageData.imageName || 'Screenshot'}
        style={{ width: '100%', height: 'auto' }}
      />
    </Container>
  )
}
