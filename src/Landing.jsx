// import React from 'react';
// import './Landing.css';
// // import image from "./images/main.jpeg"

// const Landing = ({ onStart }) => {
//   return (
//     <>
//          {/* <img src={image} alt="" />     */}
//          <div className="landing-container">
      
//       <div className="landing-content">
//         <h1>Hi, I am your digital healthcare assistant</h1>
//         <p>I am here to track your medical history</p>
//         <button onClick={onStart}>Get Started</button>
//       </div>
//     </div>
//     </>
    
//   );
// };

// export default Landing;




import React from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <div className="landing-container">
        <div className="landing-content">
          <h1>Hi, I am your digital healthcare assistant</h1>
          <p>I am here to track your medical history</p>

          {/* Go to Login page */}
          <button onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
