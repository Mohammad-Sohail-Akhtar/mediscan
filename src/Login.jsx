import React, { useState } from "react";
import './Login.css'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

export default function Login({ switchPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      console.log("Logged in:", user.user);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-btn">Login</button>
      </form>

      <p className="auth-switch">
        Don’t have an account?{" "}
        <span onClick={switchPage}>Sign Up</span>
      </p>
    </div>
  );
}
