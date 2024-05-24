import { useSSE } from 'react-hooks-sse'
import { useEffect } from 'react'

import { MetricType } from '../dataHandler/MetricTypes'

import DataSection from './DataSection'

type MainPageProps = {
  timeStamp: string
};

const handleConrolEvent = async (event: { type: string; args?: object }) => {
  console.log('Event:', event)
  try {
    switch (event.type) {
      case 'KILL_PROCESS':
        console.log('KILL_PROCESS')
        break
      case 'RESTART_PROCESS':
        console.log('RESTART_PROCESS')
        break
      case 'TAKE_SCREENSHOT':
        console.log('TAKE_SCREENSHOT')
        break
      default:
        console.log('Unknown event type:', event.type)
    }
  } catch (error) {
    console.error('Error handling control event:', error)
  }
}

function MainPage({ timeStamp }: MainPageProps) {
  const sseEvent = useSSE('PC_CONTROL_EVNET', { type: 'init' })

  useEffect(() => {
    if (sseEvent.type !== 'init') {
      handleConrolEvent(sseEvent)
    }
  }, [sseEvent])

  return (
    <header id="header">
      <DataSection metricType={MetricType.HW_INFO} />
      <DataSection metricType={MetricType.SDK_INFO} />
      <DataSection metricType={MetricType.RESOURCE_INFO} key={timeStamp} />
      <div id="result">
        <h2> Last Server Connection time is {timeStamp}</h2>
      </div>
    </header>
  )
}

export default MainPage
