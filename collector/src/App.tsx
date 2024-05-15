import DataSection from "./components/DataSection";
import { MetricType } from "./dataHandler/MetricTypes";

function App() {
  return (
    <header id='header' >
      <DataSection metricType={MetricType.HW_INFO}/>
      <DataSection metricType={MetricType.SDK_INFO}/>
      <DataSection metricType={MetricType.RESOURCE_INFO}/>
    </header>
  );
}

export default App;
