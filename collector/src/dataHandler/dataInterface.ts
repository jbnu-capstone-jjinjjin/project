import { MetricType } from "./MetricTypes";

interface machineData {
  info : hwInfo | sdkInfo | resourceInfo | null,
  metricType : MetricType | null
}

interface hwInfo {
    identifier: string;
    cpu: CPUInfo;
    ram: RAMInfo;
    gpu: GPUInfo[];
    disk: DiskInfo[];
    network: NetworkInterface[];
    os: OSInfo;
  }
  
interface CPUInfo {
    model: string;
    speed: number;
    cores: number;
  }
  
interface RAMInfo {
    total: number;
  }
  
interface GPUInfo {
    model: string;
    vram: number | null;
  }
  
interface DiskInfo {
    filesystem: string;
    size: number;
    used: number;
    available: number;
    use: number;
    mount: string;
  }
  
interface NetworkInterface {
    iface: string;
    mac: string;
    ip4?: string;
  }
  
  interface OSInfo {
    platform: string;
    release: string;
    hostname: string;
  }

interface sdkInfo {
  dotnet?: string;
  java?: string;
}

interface resourceInfo {
  cpuUsage : number
  memoryUsage : number
}

export type { machineData, hwInfo, sdkInfo, resourceInfo};
