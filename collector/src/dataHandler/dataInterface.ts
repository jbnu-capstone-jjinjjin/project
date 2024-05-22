import { MetricType } from './MetricTypes'

interface CPUInfo {
  model: string
  speed: number
  cores: number
}

interface RAMInfo {
  total: number
}

interface GPUInfo {
  model: string
  vram: number | null
}

interface DiskInfo {
  filesystem: string
  size: number
  used: number
  available: number
  use: number
  mount: string
}

interface NetworkInterface {
  iface: string
  mac: string
  ip4?: string
}

interface OSInfo {
  platform: string
  release: string
  hostname: string
}

export interface ProcessInfo{
  pid : number
  name : string
  cpu : number
  memory : number
}

export interface SDKInfo {
  dotnet?: string
  java?: string
}

export interface ResourceInfo {
  topCpu : ProcessInfo[]
  topMemory : ProcessInfo[]
}

export interface HwInfo {
  identifier: string
  cpu: CPUInfo
  ram: RAMInfo
  gpu: GPUInfo[]
  disk: DiskInfo[]
  network: NetworkInterface[]
  os: OSInfo
}

export interface MachineData {
  info: HwInfo | SDKInfo | ResourceInfo | null
  metricType: MetricType | null
}
