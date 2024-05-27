export interface MachineListProps {
  onViewDetails: (machineId: number) => void
}

export interface MachineDetailsProps {
  machineId: number
  onBack: () => void
}
export interface LogPageProps {
  machineId: number
  onBack: () => void
}
export interface SidebarProps {
  activeTab: string | null
  onTabChange: (tab: string | null) => void
}
