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

export interface ErrorResponse {
  message: string
}

export interface MachineListProps {
  onViewDetails: (machineId: number) => void
}

export interface MachineDetail {
  metrics_id: number
  metricsType: string
  createdAt: string
  data: {
    os: { release: string; hostname: string; platform: string }
    cpu: { cores: number; model: string; speed: number }
    gpu: Array<{ vram: number; model: string }>
    ram: { total: number }
    disk: Array<{
      fs: string
      rw: boolean
      use: number
      size: number
      type: string
      used: number
      mount: string
      available: number
    }>
    network: Array<{
      ip4: string
      mac: string
      iface: string
    }>
    identifier: string
  }
}

export interface MachineDetailsProps {
  machineId: number
  onBack: () => void
}
