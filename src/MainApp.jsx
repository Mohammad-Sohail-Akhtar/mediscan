// src/MainApp.jsx
import React, { useState } from 'react';
import Scanner from './Scanner';
import './App.css';
import { FaUser, FaCamera, FaBell } from 'react-icons/fa';
import AuthPages from './AuthPages';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('scanner');

  const renderContent = () => {
    switch (activeTab) {
      case 'user':
        // return <div className="tab-content"><h2>👤 User Login</h2><p>Login functionality coming soon.</p></div>;
        return <AuthPages/>
      case 'scanner':
        return <Scanner />;
      case 'reminder':
        return <div className="tab-content"><h2>⏰ Medicine Reminder</h2><p>Set reminders for your medicines here.</p></div>;
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