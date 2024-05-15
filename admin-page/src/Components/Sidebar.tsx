import { Tabs, Container, Space, Text } from '@mantine/core'

interface SidebarProps {
  activeTab: string | null
  onTabChange: (tab: string | null) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <Container bg="#f5f5f5">
      <Space h="xl" />
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        color="blue" variant='pills' orientation="vertical"
        bg='white'
      >
        <Tabs.List>
          <Tabs.Tab value="machineManagement">
            <Text size='xl'>회원관리</Text>
          </Tabs.Tab>
          <Tabs.Tab value="message">
            <Text size='xl'>메시지함</Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </Container>
  )
}
