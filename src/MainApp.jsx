// import React, { useState } from 'react';
// import Scanner from './Scanner';
// import Reminder from './Reminder';
// import AuthPages from './AuthPages';
// import './App.css';
// import { FaUser, FaCamera, FaBell } from 'react-icons/fa';
// import ReminderPage from './ReminderPage';

// const MainApp = () => {
//   const [activeTab, setActiveTab] = useState('scanner');

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'user':
//         return <AuthPages />;  // Login / Signup handled here
//       case 'scanner':
//         return <Scanner />;
//       case 'reminder':
//         return <ReminderPage/>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="main-app">
//       <div className="content-area">{renderContent()}</div>

//       <nav className="bottom-nav">
//         <button onClick={() => setActiveTab('user')} className={activeTab === 'user' ? 'active' : ''}>
//           <FaUser /><span>User</span>
//         </button>
//         <button onClick={() => setActiveTab('scanner')} className={activeTab === 'scanner' ? 'active' : ''}>
//           <FaCamera /><span>Scan</span>
//         </button>
//         <button onClick={() => setActiveTab('reminder')} className={activeTab === 'reminder' ? 'active' : ''}>
//           <FaBell /><span>Reminder</span>
//         </button>
//       </nav>
//     </div>
//   );
// };

// export default MainApp;







// import React from 'react';
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import Scanner from './Scanner';
// import ReminderPage from './ReminderPage';
// import AuthPages from './AuthPages';
// import Landing from './Landing';
// import './App.css';
// import { FaUser, FaCamera, FaBell, FaHome } from 'react-icons/fa';

// const MainApp = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <div className="main-app">

//       <div className="content-area">
//         <Routes>
//           <Route path="/" element={<Landing onStart={() => navigate('/scanner')} />} />
//           <Route path="/scanner" element={<Scanner />} />
//           <Route path="/reminder" element={<ReminderPage />} />
//           <Route path="/user" element={<AuthPages />} />
//         </Routes>
//       </div>

//       <nav className="bottom-nav">
//         <button 
//           onClick={() => navigate('/')} 
//           className={location.pathname === '/' ? 'active' : ''}
//         >
//           <FaHome /><span>Home</span>
//         </button>

//         <button 
//           onClick={() => navigate('/user')} 
//           className={location.pathname === '/user' ? 'active' : ''}
//         >
//           <FaUser /><span>User</span>
//         </button>

//         <button 
//           onClick={() => navigate('/scanner')} 
//           className={location.pathname === '/scanner' ? 'active' : ''}
//         >
//           <FaCamera /><span>Scan</span>
//         </button>

//         <button 
//           onClick={() => navigate('/reminder')} 
//           className={location.pathname === '/reminder' ? 'active' : ''}
//         >
//           <FaBell /><span>Reminder</span>
//         </button>
//       </nav>

//     </div>
//   );
// };

// export default MainApp;





import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Scanner from "./Scanner";
import ReminderPage from "./ReminderPage";
import AuthPages from "./AuthPages";
import Landing from "./Landing";
import { auth } from "./Firebase";
import { FaUser, FaCamera, FaBell, FaHome, FaSignOutAlt } from "react-icons/fa";

const MainApp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="main-app">
      <div className="content-area">
        <Routes>
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/reminder" element={<ReminderPage />} />
          <Route path="/user" element={<AuthPages />} />
        </Routes>
      </div>

      {/* NAV BAR */}
      <nav className="bottom-nav">
        <button 
          onClick={() => navigate("/app/scanner")}
          className={location.pathname.includes("scanner") ? "active" : ""}
        >
          <FaCamera /><span>Scan</span>
        </button>

        <button 
          onClick={() => navigate("/app/reminder")}
          className={location.pathname.includes("reminder") ? "active" : ""}
        >
          <FaBell /><span>Reminder</span>
        </button>

        {/* <button 
          onClick={() => navigate("/app/user")}
          className={location.pathname.includes("user") ? "active" : ""}
        >
          <FaUser /><span>Profile</span>
        </button> */}

        <button onClick={handleLogout}>
          <FaSignOutAlt /><span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default MainApp;
