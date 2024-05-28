export interface Machine {
  machineId: number
  machineName: string
}

export interface MachineData {
  status: number
  timestamp: string
  message: string
  data: Machine[]
}

export interface Os {
  release: string
  hostname: string
  platform: string
}

export interface Cpu {
  cores: number
  model: string
  speed: number
}

export interface Gpu {
  vram: number
  model: string
}

export interface Ram {
  total: number
}

export interface Disk {
  fs: string
  rw: boolean
  use: number
  size: number
  type: string
  used: number
  mount: string
  available: number
}

export interface Network {
  ip4: string
  mac: string
  iface: string
}

export interface CommandData {
  machineId: number
  control: {
    command: string
    args: string[]
  }
}

export interface ScreenshotData {
  machineId: number
  screenshotId: number
  imageName: string
  createdAt: string
}

export interface ErrorResponse {
  message: string
}

export interface ResponseData {
  message: string
}

export interface ProcessInfo {
  pid: number
  name: string
  cpu: number
  memory: number
}

export interface SDKInfo {
  dotnet: string
  java: string
}

export interface ResourceInfo {
  topCpu: ProcessInfo[]
  topMemory: ProcessInfo[]
}

export interface HwInfo {
  os: Os
  cpu: Cpu
  gpu: Gpu[]
  ram: Ram
  disk: Disk[]
  network: Network[]
  identifier: string
}
export interface InfoData {
  metrics_id: number
  metricsType: 'HW_INFO' | 'SDK_INFO' | 'RESOURCE_INFO'
  createdAt: string
  data: HwInfo | SDKInfo | ResourceInfo
}
