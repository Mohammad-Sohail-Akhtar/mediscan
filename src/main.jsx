import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Landing from './Landing';
import MainApp from './MainApp'; // This is the scanner + bottom nav

const App = () => {
  const [started, setStarted] = useState(false);

  return started ? <MainApp /> : <Landing onStart={() => setStarted(true)} />;
};

createRoot(document.getElementById('root')).render(<App />);