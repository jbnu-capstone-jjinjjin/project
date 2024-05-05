import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';
import Sidebar from './Sidebar.tsx';
import MemberList from './MemberList.tsx';
import MemberDetail from './MemberDetails.tsx';
import { Member } from './data.ts';
import { membersData } from './membersdata.ts';

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<string | null>('memberManagement');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("로그아웃 성공");
    }).catch((error) => {
      alert("로그아웃 실패: " + error.message);
    });
  };

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
  };

  const handleBack = () => {
    setSelectedMember(null);
  };

  if (loading) {
    return <div>로딩 중</div>;
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>Please Log in</h1>
        <button onClick={handleLogin} style={{ fontSize: '30px' }}>
          구글 로그인
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px', background: '#f5f5f5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <span>Welcome, {user ? (user.displayName + " UID : " + user.uid) : 'No Name'}</span>
          <button onClick={handleLogout} style={{ fontSize: '12px' }}>로그아웃</button>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div style={{ flex: 1, padding: '20px' }}>
          {activeTab === 'memberManagement' && !selectedMember && <MemberList members={membersData} onViewDetails={handleViewDetails} />}
          {activeTab === 'memberManagement' && selectedMember && <MemberDetail member={selectedMember} onBack={handleBack} />}
          {activeTab === 'message' && <div><h1>Message Content</h1></div>}
          {activeTab === 'notices' && <div><h1>Notices Content</h1></div>}
        </div>
      </div>
    </div>
  );
}
