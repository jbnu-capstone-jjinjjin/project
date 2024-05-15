import { MetricType } from '../dataHandler/MetricTypes'

import DataSection from './DataSection'

type MainPageProps = {
  timeStamp: string
};

function MainPage({ timeStamp }: MainPageProps) {
  return (
    <header id="header">
      <DataSection metricType={MetricType.HW_INFO} />
      <DataSection metricType={MetricType.SDK_INFO} />
      <DataSection metricType={MetricType.RESOURCE_INFO} />
      <div id="result" >
        <h2> Last Server Connection time is {timeStamp}</h2>
      </div>
    </header>
  )
}

export default MainPage
