import { Member } from "./data.ts";

export const membersData: Member[] = [
    { 
        id: 202117122, 
        name: '김재현', 
        email: 'rlawogus65@gmail.com',
        specs: {
            cpu: 'specs.cpu',
            ram: 'specs.ram',
            vga: 'specs.vga',
            storage: 'specs.storage'
        },
        network: {
            mac: 'network.mac',
            ip: 'network.ip'
        },
        os: {
            type: 'os.type',
            version: 'os.version',
            computerName: 'os.computerName'
        },
        sdk: {
            netFramework: 'sdk.netFramework',
            jdk: 'sdk.jdk'
        },
        resourceUsage: {
            cpu: 'resourceUsage.cpu',
            ram: 'resouceUsage.ram',
            network: 'resourceUsage.network',
            disk: 'resourceUsage.disk'
        }
    },
    {
        id: 20202020,
        name: '예시',
        email: '이메일',
        specs: {
            cpu: 'CPU의 사양입니다.',
            ram: 'RAM의 용량입니다.',
            vga: '그래픽 카드 사양입니다.',
            storage: '디스크 용량입니다.'
        },
        network: {
            mac: 'MAC 주소입니다.',
            ip: 'IP 주소입니다.'
        },
        os: {
            type: 'OS 종류입니다.',
            version: 'OS 버전입니다.',
            computerName: '컴퓨터의 이름입니다.'
        },
        sdk: {
            netFramework: '.NET Framework의 버전입니다.',
            jdk: 'JDK의 버전입니다.'
        },
        resourceUsage: {
            cpu: 'CPU 사용률입니다 (%).',
            ram: 'RAM 사용률입니다 (%).',
            network: '네트워크 사용량입니다 (Mbps).',
            disk: '디스크 사용량입니다 (MB).'
        }
    }
];