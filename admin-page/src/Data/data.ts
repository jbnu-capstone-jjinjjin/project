export interface Specs {
    cpu: string
    ram: string
    vga: string
    storage: string
}

export interface Network {
    mac: string
    ip: string
}

export interface Os {
    type: string
    version: string
    computerName: string
}

export interface Sdk {
    netFramework: string
    jdk: string
}

export interface ResourceUsage {
    cpu: string
    ram: string
    network: string
    disk: string
}

export interface Member {
    id: number
    pos_num: number
    pos_name: string
    specs: Specs
    network: Network
    os: Os
    sdk: Sdk
    resourceUsage: ResourceUsage
}
