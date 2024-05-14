import React from 'react';
import { Table, Button } from '@mantine/core';
import { Member } from '../Data/data.ts';

interface MemberListProps {
  members: Member[];
  onViewDetails: (member: Member) => void;
}

export default function MemberList({ members, onViewDetails }: MemberListProps) {
  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>ID</th>
          <th>POS_NUM</th>
          <th>POS_NAME</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>{member.id}</td>
            <td>{member.pos_num}</td>
            <td>{member.pos_name}</td>
            <td>
              <Button onClick={() => onViewDetails(member)}>View</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
