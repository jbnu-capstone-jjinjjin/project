import axios from 'axios';
import { collectSystemInfo } from './dataCollector';
import { SystemInfo } from './dataInterface';
import { MetricType } from './MetricTypes';

const API_URL = process.env.API_URL

async function sendSystemInfo(systemInfo: SystemInfo): Promise<void> {
    try {
        const machineId = 1;  // 임시 방편

        const metricsResponse = await axios.post(`${API_URL}/metrics`, {
            machine_id: machineId,
            timestamp: new Date().toISOString(),
            metric_type: MetricType.FullSystemInfo,
            data: systemInfo
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

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
    await sendSystemInfo(systemInfo);
}

console.log(API_URL)