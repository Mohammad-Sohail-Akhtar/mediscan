// import React, { useState } from "react";
// import './Login.css'
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./Firebase";

// export default function Login({ switchPage }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const user = await signInWithEmailAndPassword(auth, email, password);
//       alert("Login successful!");
//       console.log("Logged in:", user.user);
//     } catch (err) {
//       alert(err.message);
//     }
//   }; 

//   return (
//     <div className="auth-card">
//       <h2 className="auth-title">Login</h2>
//       <form onSubmit={handleLogin} className="auth-form">
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="auth-input"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="auth-input"
//           required
//         />
//         <button type="submit" className="auth-btn">Login</button>
//       </form>

//       <p className="auth-switch">
//         Don’t have an account?{" "}
//         <span onClick={switchPage}>Sign Up</span>
//       </p>
//     </div>
//   );
// }









// import React, { useState } from "react";
// import "./Login.css";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./Firebase";
// import { useNavigate } from "react-router-dom";

// export default function Login({ switchPage }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       alert("Login successful!");
//       navigate("/app/scanner"); // go to scanner
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="auth-card">
//       <h2 className="auth-title">Login</h2>

//       <form onSubmit={handleLogin} className="auth-form">
//         <input
//           type="email"
//           placeholder="Email"
//           className="auth-input"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="auth-input"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit" className="auth-btn">Login</button>
//       </form>

//       <p className="auth-switch">
//         Don’t have an account? <span onClick={switchPage}>Sign Up</span>
//       </p>
//     </div>
//   );
// }



import React, { useState } from "react";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successfully")
      navigate("/app/scanner"); // go to scanner page after login
    } catch (err) {
     toast.error(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-btn">Login</button>
      </form>

      <p className="auth-switch">
        Don’t have an account?{" "}
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}
