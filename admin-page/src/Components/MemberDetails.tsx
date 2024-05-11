import { Container, Button, Table } from '@mantine/core'

import { Member } from '../Data/data'

interface MemberDetailProps {
  member: Member
  onBack: () => void
}

export default function MemberDetail({ member, onBack }: MemberDetailProps) {
  const rows = [
    ['POS_NUM', member.pos_num],
    ['POS_NAME', member.pos_name],
    ['CPU', member.specs.cpu],
    ['RAM', member.specs.ram],
    ['VGA', member.specs.vga],
    ['Storage', member.specs.storage],
    ['MAC Address', member.network.mac],
    ['IP Address', member.network.ip],
    ['OS Type', member.os.type],
    ['OS Version', member.os.version],
    ['Computer Name', member.os.computerName],
    ['.NET Framework', member.sdk.netFramework],
    ['JDK', member.sdk.jdk],
    ['CPU Usage', member.resourceUsage.cpu],
    ['RAM Usage', member.resourceUsage.ram],
    ['Network Usage', member.resourceUsage.network],
    ['Disk Usage', member.resourceUsage.disk]
  ]

  return (
    <Container>
      <Button onClick={onBack} style={{ marginTop: '20px', marginBottom: '20px' }}>Back</Button>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button style={{ marginTop: '20px' }}>스크린샷 요청</Button>
      <Button style={{ marginLeft: '10px' }}>로그</Button>
      <Button style={{ marginLeft: '10px' }}>메시지</Button>
    </Container>
  )
}
