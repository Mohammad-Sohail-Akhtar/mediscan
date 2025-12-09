import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Scanner from "./Scanner";
import ReminderPage from "./ReminderPage";
import AuthPages from "./AuthPages";
import Landing from "./Landing";
import { auth } from "./Firebase";
import { FaUser, FaCamera, FaBell, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import './MainApp.css'

const MainApp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="main-app">

      {/* SIDEBAR */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className="sidebar-menu">
          <button
            onClick={() => navigate("/app/scanner")}
            className={location.pathname.includes("scanner") ? "active" : ""}
          >
            <FaCamera /> <span>Scan</span>
          </button>

          <button
            onClick={() => navigate("/app/reminder")}
            className={location.pathname.includes("reminder") ? "active" : ""}
          >
            <FaBell /> <span>Reminder</span>
          </button>

          <button onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className={`content-area ${isOpen ? "shift" : ""}`}>
        <Routes>
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/reminder" element={<ReminderPage />} />
          <Route path="/user" element={<AuthPages />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainApp;
