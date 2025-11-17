import React, { useState } from 'react';
import Scanner from './Scanner';
// import Reminder from './Reminder';
import AuthPages from './AuthPages';
import './App.css';
import { FaUser, FaCamera, FaBell } from 'react-icons/fa';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('scanner');

  const renderContent = () => {
    switch (activeTab) {
      case 'user':
        return <AuthPages />;  // Login / Signup handled here
      case 'scanner':
        return <Scanner />;
      case 'reminder':
        return <Reminder />;
      default:
        return null;
    }
  };

  return (
    <div className="main-app">
      <div className="content-area">{renderContent()}</div>

      <nav className="bottom-nav">
        <button onClick={() => setActiveTab('user')} className={activeTab === 'user' ? 'active' : ''}>
          <FaUser /><span>User</span>
        </button>
        <button onClick={() => setActiveTab('scanner')} className={activeTab === 'scanner' ? 'active' : ''}>
          <FaCamera /><span>Scan</span>
        </button>
        <button onClick={() => setActiveTab('reminder')} className={activeTab === 'reminder' ? 'active' : ''}>
          <FaBell /><span>Reminder</span>
        </button>
      </nav>
    </div>
  );
};

export default MainApp;
