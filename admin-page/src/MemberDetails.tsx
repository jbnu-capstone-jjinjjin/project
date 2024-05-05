import React from 'react';
import { Button, Text } from '@mantine/core';
import { Member } from './data.ts';

interface MemberDetailProps {
  member: Member;
  onBack: () => void;
}

const MemberDetail: React.FC<MemberDetailProps> = ({ member, onBack }) => {
  return (
    <div>
        <Button onClick={onBack} style={{ marginTop: '20px' }}>Back</Button>
        <Text size="lg">Member Information</Text>
        <Text>Name: {member.name}</Text>
        <Text>Email: {member.email}</Text>
        <Text>specs.cpu: {member.specs.cpu}</Text>
        <Text>specs.ram: {member.specs.ram}</Text>
        <Text>specs.vga: {member.specs.vga}</Text>
        <Text>specs.storage: {member.specs.storage}</Text>
        <Text>network.mac: {member.network.mac}</Text>
        <Text>network.ip: {member.network.ip}</Text>
        <Text>os.type: {member.os.type}</Text>
        <Text>os.version: {member.os.version}</Text>
        <Text>os.computerName: {member.os.computerName}</Text>
        <Text>sdk.netFramework: {member.sdk.netFramework}</Text>
        <Text>sdk.jdk: {member.sdk.jdk}</Text>
        <Text>resourceUsage.cpu: {member.resourceUsage.cpu}</Text>
        <Text>resourceUsage.ram: {member.resourceUsage.ram}</Text>
        <Text>resourceUsage.network: {member.resourceUsage.network}</Text>
        <Text>resourceUsage.disk: {member.resourceUsage.disk}</Text>
    </div>
  );
};

export default MemberDetail;
