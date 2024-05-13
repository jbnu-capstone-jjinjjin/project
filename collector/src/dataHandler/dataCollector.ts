import * as os from 'os';  
import * as si from 'systeminformation';
import { machineId } from 'node-machine-id';
import {execSync} from 'child_process'

import { HWUsage, SDKInfo, SystemInfo} from './dataInterface';

async function collectSystemInfo(): Promise<SystemInfo> {
  try {
    console.log("=== Start Collect System Info ===");

    const cpuInfo = os.cpus();
    const cpuCores = cpuInfo.length;
    const cpuModel = cpuInfo[0].model;
    const cpuSpeed = cpuInfo[0].speed;

    const [
      graphics,
      rawNetworkInterfaces,
      UUID,
      disks
    ] = await Promise.all([
      si.graphics(),
      si.networkInterfaces(),
      machineId(true),
      si.fsSize()
    ]);

    const networkInterfaces = Array.isArray(rawNetworkInterfaces) ? rawNetworkInterfaces : [rawNetworkInterfaces];

    const systemInfo: SystemInfo = {
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
        vram: gpu.vram !== null ? gpu.vram : 0
      })),
      disk: disks.map(disk => ({
        filesystem: disk.fs,
        size: disk.size,
        used: disk.used,
        available: disk.available,
        use: disk.use,
        mount: disk.mount
      })),
      network: networkInterfaces.map(net => ({
        iface: net.iface,
        mac: net.mac,
        ip4: net.ip4 || 'N/A'
      })),
      os: {
        platform: os.platform(),
        release: os.release(),
        hostname: os.hostname()
      }
    };

    console.log(systemInfo);
    console.log("=== Success Collect System Info ===");
    return systemInfo;
  } catch (error) {
    console.error("Failed to fetch system information:", error);
    throw new Error("Failed to fetch system information");
  }
}

async function collectSDKInfo(): Promise<SDKInfo> {
  try {
      console.log("=== Start Collect SDK Info ===");

      const sdkInfo: SDKInfo = {};

      const javaVersion = execSync('java --version').toString();
      sdkInfo.java = javaVersion || 'Java not found';

      const dotnetVersion = execSync('dotnet --version').toString().trim();
      sdkInfo.dotnet = dotnetVersion || 'dotnet not found';

      console.log(sdkInfo);
      console.log("=== Success Collect SDK Info ===");

      return sdkInfo;
  } catch (error) {
      console.error("Failed to fetch SDK information:", error);
      throw new Error("Failed to fetch SDK information");
  }
}

async function collectSystemUsageInfo(): Promise<HWUsage> {
  try {
      console.log("=== Start Collect Usage Info ===");
      
      const cpuLoad = await si.currentLoad();
      const cpuUsage = cpuLoad.currentLoad;

      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;

      const usage: HWUsage = {
          cpuUsage: cpuUsage,
          memoryUsage: memoryUsage
      };
      
      console.log(usage);
      console.log("=== Success Collect Usage Info ===");
      return usage;
  } catch (error) {
      console.error("Failed to fetch usage information:", error);
      throw new Error("Failed to fetch usage information");
  }
}

export {collectSystemInfo, collectSDKInfo, collectSystemUsageInfo};
