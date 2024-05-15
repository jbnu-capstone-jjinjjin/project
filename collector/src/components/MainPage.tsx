import DataSection from "./DataSection";
import { MetricType } from "../dataHandler/MetricTypes";

type MainPageProps = {
  timeStamp: String;
};

function MainPage({ timeStamp }: MainPageProps) {
  return (
    <header id="header">
      <DataSection metricType={MetricType.HW_INFO} />
      <DataSection metricType={MetricType.SDK_INFO} />
      <DataSection metricType={MetricType.RESOURCE_INFO} />
      <div id="result" >
        <h2> Last Server Connetion time is {timeStamp}</h2>
      </div>
    </header>
  );
}

export default MainPage;
