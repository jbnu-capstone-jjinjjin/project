const os = require('os');
const si = require('systeminformation');
const { machineId } = require('node-machine-id');

async function collectSystemInfo() {
  try {
    console.log("\n\n===Start Collect System Info===")
    const cpuInfo = os.cpus(); // CPU 정보 배열
    const cpuCores = cpuInfo.length; // CPU 코어 수
    const cpuModel = cpuInfo[0].model; // 첫 번째 CPU 모델
    const cpuSpeed = cpuInfo[0].speed; // 첫 번째 CPU 속도

    // 동시에 수행할 비동기 작업
    const [
      graphics,
      networkInterfaces,
      UUID,
      diskSize
    ] = await Promise.all([
      si.graphics(),
      si.networkInterfaces(),
      machineId(true),
      si.fsSize()
    ]);

    // 수집된 정보를 객체로 구성
    const systemInfo = {
      identifier: UUID,
      cpu: {
        model: cpuModel,
        speed: cpuSpeed,
        cores: cpuCores
      },
      ram: {
        total: os.totalmem()
      },
      gpu: graphics.controllers.map(gpu => ({
        model: gpu.model,
        vram: gpu.vram
      })),
      disk: diskSize,
      network: networkInterfaces.map(net => ({
        iface: net.iface,
        mac: net.mac,
        ip4: net.ip4
      })),
      os: {
        platform: os.platform(),
        release: os.release(),
        hostname: os.hostname()
      }
    };

    console.log(systemInfo);
    console.log("===Success Collect System Info===\n\n")
    return systemInfo;
  } catch (error) {
    console.error("Failed to fetch system information:", error);
  }
}

module.exports = collectSystemInfo;