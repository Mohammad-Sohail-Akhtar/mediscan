import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Landing from './Landing';
import MainApp from './MainApp'; // This is the scanner + bottom nav

const App = () => {
  const [started, setStarted] = useState(false);

  return started ? <MainApp /> : <Landing onStart={() => setStarted(true)} />;
};

createRoot(document.getElementById('root')).render(<App />);



// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App'
// import { BrowserRouter } from 'react-router-dom'
// // import App from './App.jsx'
// // 
// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <App/>
//   </BrowserRouter>,
// )