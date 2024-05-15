import { useState, useEffect } from "react";

import {sendAndGetHwInfo,sendAndGetResourceInfo,sendAndGetSDKInfo,} from "../dataHandler/dataSender";
import { MetricType } from "../dataHandler/MetricTypes";
import { machineData } from "../dataHandler/dataInterface";

type DataSectionProps = {
  metricType: MetricType;
};

function initializeMachineData(metricType: MetricType): Promise<machineData> {
  switch (metricType) {
    case MetricType.HW_INFO:
      return sendAndGetHwInfo();
    case MetricType.RESOURCE_INFO:
      return sendAndGetResourceInfo();
    case MetricType.SDK_INFO:
      return sendAndGetSDKInfo();
    default:
      return Promise.resolve({
        info: null,
        metricType: null,
      });
  }
}

function renderInfoContent(infoData: any) {
  return Object.entries(infoData).map(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (
        <div key={key} className="section">
          <h3>{key.toUpperCase()}</h3>
          {renderInfoContent(value)}
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div key={key} className="section">
          <h3>{key.toUpperCase()}</h3>
          {value.map((item, index) => (
            <div key={index} className="item">{renderInfoContent(item)}</div>
          ))}
        </div>
      );
    } else {
      return <p key={key}><strong>{key}:</strong> {String(value) ?? "Not available"}</p>
    }
  });
}

function DataSection({ metricType }: DataSectionProps): React.ReactElement {
  const [info, setInfo] = useState<machineData | null>(null);

  useEffect(() => {
    initializeMachineData(metricType).then((data) => {
      setInfo(data);
    });
  }, [metricType]);

  return (
    <div id="result">
      {info ? (
        <div>
          <h2>{`${info.metricType}:`}</h2>
          {info.info ? renderInfoContent(info.info) : <p>No data available.</p>}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DataSection;
