const axios = require('axios');
const collectSystemInfo = require('./dataCollector');

async function sendSystemInfo(systemInfo) {
    try {
        // 기기 정보를 서버에 등록
        // 아래 주석 코드는 서버 반응을 통해 머신 ID를 갖고 온다면 해제함.
        // const machineResponse = await axios.post('http://localhost:8080/machines', {
        //     machine_name: systemInfo.os.hostname  // 예: 'DESKTOP-T2D6PKV'
        // });

        // 기기 ID를 응답에서 추출
        //machineResponse.data.id 서버 반응을 통해 머신 ID를 갖고온다면 1 대신에 이것을 사용함.
        const machineId = 1;  //임시 방편

        // 메트릭 정보를 서버에 보냄
        const metricsResponse = await axios.post('http://localhost:8080/metrics', {
            machine_id: machineId,
            timestamp: new Date().toISOString(),
            metric_type: 'full_system_info',
            data: systemInfo
        });

        console.log('Data sent successfully:', metricsResponse.data);
            console.log("Success Send SystemInfo")
    } catch (error) {
        console.error('Failed to send system info:', error);
    }
}

// collectSystemInfo 함수는 앞서 설명한 대로 시스템 정보를 수집하는 함수
collectSystemInfo().then(systemInfo => {
    sendSystemInfo(systemInfo);
});
