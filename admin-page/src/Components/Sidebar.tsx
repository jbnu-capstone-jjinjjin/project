import { Tabs } from '@mantine/core'

interface SidebarProps {
  activeTab: string | null
  onTabChange: (tab: string | null) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabStyle = {
    height: '50px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    margin: '5px',
    cursor: 'pointer'
  }

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#1C7ED6',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  }

  return (
    <Tabs
      value={activeTab}
      onChange={onTabChange}
      orientation="vertical"
      style={{
        width: '200px',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '10px',
      }}
    >
      <Tabs.List style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Tabs.Tab
          value="memberManagement"
          style={activeTab === 'memberManagement' ? activeTabStyle : tabStyle}>
          회원관리
        </Tabs.Tab>
        <Tabs.Tab
          value="message"
          style={activeTab === 'message' ? activeTabStyle : tabStyle}>
          메시지함
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}
