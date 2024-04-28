import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  

  return (
    <div style={{ width: '200px', height: '100vh', background: 'gray' , padding: '20px' }}>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        <li><Link to="/">메인화면</Link></li>
        <li><Link to="/profile">유저관리</Link></li>
        <li><Link to="/messages">메시지함</Link></li>
        <li><Link to="/notifications">공지사항</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
