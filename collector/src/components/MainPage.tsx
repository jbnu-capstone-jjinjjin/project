import { useSSE } from 'react-hooks-sse'
import { useEffect, useState } from 'react'

import { MetricType } from '../dataHandler/MetricTypes'
import { closeProcess } from '../util/closeProcess'

import { takeScreenshot, uploadScreenshot } from '../util/takeScreenshot'


import DataSection from './DataSection'

type MainPageProps = {
  timeStamp: string
};

type ControlEvent = {
  command: string
  args: object
}

const initControlEvent: ControlEvent = {
  command: 'init',
  args: {}
}

const handleConrolEvent = async (event: ControlEvent) => {
  console.log('Event:', event)
  const command = event.command
  const args = event.args
  try {
    switch (command) {
      case 'KILL_PROCESS':
        closeProcess(args)
        break
      case 'RESTART_PROCESS':
        console.log('RESTART_PROCESS')
        break
      case 'TAKE_SCREENSHOT':
        takeScreenshot()
        uploadScreenshot()
        break
      default:
        console.log('Unknown event type:', command)
    }
  } catch (error) {
    console.error('Error handling control event:', error)
  }
}

function MainPage({ timeStamp }: MainPageProps) {
  const sseEvent = useSSE('machineOrder', initControlEvent)
  const [eventCounter, setEventCounter] = useState(0)

  useEffect(() => {
    if (sseEvent.command !== 'init') {
      handleConrolEvent(sseEvent)
      setEventCounter(eventCounter + 1)
    }
  }, [sseEvent])

  return (
    <header id="header">
      <DataSection metricType={MetricType.HW_INFO} />
      <DataSection metricType={MetricType.SDK_INFO} />
      <DataSection metricType={MetricType.RESOURCE_INFO} key={`${timeStamp}-${eventCounter}`} />
      <div id="result">
        <h2> Last Server Connection time is {timeStamp}</h2>
      </div>
    </header>
  )
}

export default MainPage
