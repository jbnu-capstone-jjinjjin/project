import { Member } from './data'

export const membersData: Member[] = [
  {
    id: 1,
    pos_num: 123,
    pos_name: 'Position 1',
    specs: {
      cpu: 'Intel Core i5',
      ram: '8GB DDR4',
      vga: 'NVIDIA GeForce GTX 1650',
      storage: '512GB SSD'
    },
    network: {
      mac: '00:11:22:33:44:55',
      ip: '192.168.1.100'
    },
    os: {
      type: 'Windows',
      version: '10',
      computerName: 'DESKTOP-ABC123'
    },
    sdk: {
      netFramework: '4.8',
      jdk: '11'
    },
    resourceUsage: {
      cpu: '30%',
      ram: '60%',
      network: '50Mbps',
      disk: '40%'
    }
  },
  {
    id: 2,
    pos_num: 456,
    pos_name: 'Position 2',
    specs: {
      cpu: 'AMD Ryzen 7',
      ram: '16GB DDR4',
      vga: 'AMD Radeon RX 5700 XT',
      storage: '1TB NVMe SSD'
    },
    network: {
      mac: 'AA:BB:CC:DD:EE:FF',
      ip: '192.168.1.101'
    },
    os: {
      type: 'Windows',
      version: '11',
      computerName: 'LAPTOP-XYZ789'
    },
    sdk: {
      netFramework: 'None',
      jdk: '15'
    },
    resourceUsage: {
      cpu: '40%',
      ram: '70%',
      network: '60Mbps',
      disk: '50%'
    }
  },
  {
    id: 3,
    pos_num: 789,
    pos_name: 'Position 3',
    specs: {
      cpu: 'Intel Core i7',
      ram: '32GB DDR4',
      vga: 'NVIDIA GeForce RTX 3080',
      storage: '2TB HDD'
    },
    network: {
      mac: '11:22:33:44:55:66',
      ip: '192.168.1.102'
    },
    os: {
      type: 'Linux',
      version: 'Ubuntu 20.04',
      computerName: 'SERVER-123456'
    },
    sdk: {
      netFramework: 'None',
      jdk: 'OpenJDK 11'
    },
    resourceUsage: {
      cpu: '50%',
      ram: '80%',
      network: '70Mbps',
      disk: '60%'
    }
  },
  {
    id: 4,
    pos_num: 101,
    pos_name: 'Position 4',
    specs: {
      cpu: 'Intel Core i9',
      ram: '64GB DDR4',
      vga: 'NVIDIA Quadro RTX 8000',
      storage: '4TB SSD'
    },
    network: {
      mac: '22:33:44:55:66:77',
      ip: '192.168.1.103'
    },
    os: {
      type: 'Windows',
      version: '11',
      computerName: 'DESKTOP-123ABC'
    },
    sdk: {
      netFramework: '4.8',
      jdk: 'AdoptOpenJDK 16'
    },
    resourceUsage: {
      cpu: '60%',
      ram: '90%',
      network: '80Mbps',
      disk: '70%'
    }
  },
  {
    id: 5,
    pos_num: 202,
    pos_name: 'Position 5',
    specs: {
      cpu: 'AMD Ryzen 5',
      ram: '16GB DDR4',
      vga: 'NVIDIA GeForce GTX 1660 Super',
      storage: '512GB SSD + 1TB HDD'
    },
    network: {
      mac: '33:44:55:66:77:88',
      ip: '192.168.1.104'
    },
    os: {
      type: 'MacOS',
      version: 'Big Sur',
      computerName: 'MAC-MINI'
    },
    sdk: {
      netFramework: 'None',
      jdk: 'None'
    },
    resourceUsage: {
      cpu: '70%',
      ram: '80%',
      network: '90Mbps',
      disk: '80%'
    }
  }
]
