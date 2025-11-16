import React from 'react';
import './Landing.css';

const Landing = ({ onStart }) => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Hi, I am your digital healthcare assistant</h1>
        <p>I am here to track your medical history</p>
        <button onClick={onStart}>Get Started</button>
      </div>
    </div>
  );
};

export default Landing;