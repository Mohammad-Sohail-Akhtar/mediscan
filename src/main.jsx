// import React, { useState } from 'react';
// import { createRoot } from 'react-dom/client';
// import Landing from './Landing';
// import MainApp from './MainApp'; // This is the scanner + bottom nav

// const App = () => {
//   const [started, setStarted] = useState(false);

//   return started ? <MainApp /> : <Landing onStart={() => setStarted(true)} />;
// };

// createRoot(document.getElementById('root')).render(<App/>);




// // )




// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import MainApp from './MainApp';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <MainApp />
//     </BrowserRouter>
//   );
// };

// createRoot(document.getElementById('root')).render(<App />);





import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Login from "./Login";
import Signup from "./Signup";
import MainApp from "./MainApp";
import { auth } from "./Firebase";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase authentication listener
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
    <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        {/* Landing (No Nav) */}
        <Route path="/" element={<Landing />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Pages (only visible after login + nav shows inside MainApp) */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute user={user}>
              <MainApp />
              
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    
  );
};

createRoot(document.getElementById("root")).render(<App />);


