import axios from 'axios';
import {config as configDotenv} from 'dotenv'

import { collectSystemInfo } from './dataCollector';
import { SystemInfo } from './dataInterface';
import { MetricType } from './MetricTypes';

configDotenv();
const API_URL = process.env.API_URL;

async function sendSystemHWInfo(systemInfo: SystemInfo): Promise<void> {
    try {

        // 기기 정보를 서버에 등록
        // 아래 주석 코드는 서버 반응을 통해 머신 ID를 갖고 온다면 해제함.
        const machineResponse = await axios.post(`${API_URL}/machines`, {
            machineName: systemInfo.os.hostname 
        });

        // 기기 ID를 응답에서 추출
        const machineId = machineResponse.data.data.machine_id; // 서버 반응을 통해 머신 ID를 갖고온다면 1 대신에 이것을 사용함.
        
        // const machineId = 1

        // 메트릭 정보를 서버에 보냄

        const metricsResponse = await axios.post(`${API_URL}/metrics`, {
            machine_id: machineId,
            timestamp: new Date().toISOString(),
            metric_type: MetricType.HW_INFO,
            data: systemInfo
        },);

        console.log('Data sent successfully:', metricsResponse.data);
    } catch (error: any) {
        if (error.response) {
            console.error('Failed to send system info:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up the request:', error.message);
        }
    }
}

async function main() {
    const systemInfo = await collectSystemInfo();
    await sendSystemHWInfo(systemInfo)
    console.log(API_URL)
}

main();