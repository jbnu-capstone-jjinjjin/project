import React from 'react';
import { Table, Button } from '@mantine/core';
import { Member } from './data.ts';

interface MemberListProps {
  members: Member[];
  onViewDetails: (member: Member) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, onViewDetails }) => {
  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>{member.name}</td>
            <td>{member.email}</td>
            <td>
              <Button onClick={() => onViewDetails(member)}>View</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MemberList;
