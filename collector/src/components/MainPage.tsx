import { useSSE } from 'react-hooks-sse'
import { useEffect, useState } from 'react'

import { MetricType } from '../dataHandler/MetricTypes'
import { closeProcess } from '../util/closeProcess'

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
        console.log('TAKE_SCREENSHOT')
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
  useEffect(() => {
    if (sseEvent.command !== 'init') {
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
