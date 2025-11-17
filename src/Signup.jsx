import React, { useState } from "react";
import './Signup.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

export default function Signup({ switchPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      console.log("User created:", user.user);
      switchPage(); // back to login
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Sign Up</h2>
      <form onSubmit={handleSignup} className="auth-form">
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-btn">Sign Up</button>
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <span onClick={switchPage}>Login</span>
      </p>
    </div>
  );
}
