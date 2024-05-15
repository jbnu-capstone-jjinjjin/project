import axios from "axios";
import * as os from "os";

import { machineData} from "./dataInterface";
import {collectHwInfo, collectSDKInfo, collectResouceInfo} from "./dataCollector"

const API_URL = process.env.API_URL;

async function sendMachineData(machineData:machineData) {
  try{
    const machineResponse = await axios.post(`${API_URL}/machines`, {
      machineName: os.hostname(),
    });
    const machineId = machineResponse.data.data.machine_id;

    const metricsResponse = await axios.post(`${API_URL}/metrics`,{
      machine_Id: machineId,
      timestamp : new Date().toISOString(),
      metric_type:machineData.metricType,
      data:machineData.info,
    });

    console.log("MachineData sent successfully:", metricsResponse.data);
  }
  catch(error : any){
    if (error.response) {
      console.error(
        "Failed to send machine data:",
        machineData.metricType,
        machineData.info,
        error.response.status
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
  }
}

async function sendAndGetSDKInfo(): Promise<machineData> {
  const machineData = await collectSDKInfo();
  await sendMachineData(machineData);
  return machineData
}
async function sendAndGetHwInfo(): Promise<machineData> {
  const machineData = await collectHwInfo();
  await sendMachineData(machineData);
  return machineData
}
async function sendAndGetResourceInfo(): Promise<machineData> {
  const machineData = await collectResouceInfo();
  await sendMachineData(machineData);
  return machineData
}

export {sendAndGetSDKInfo, sendAndGetHwInfo, sendAndGetResourceInfo}