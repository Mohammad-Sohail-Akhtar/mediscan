import React, { useState } from "react";
import "./Signup.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      console.log("User created:", user.user);
      alert("Account created successfully!");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">

        <h2 className="signup-title">Create an Account</h2>

        <form onSubmit={handleSignup}>
          <label className="signup-label">Full Name</label>
          <input
            name="fullName"
            type="text"
            className="signup-input"
            onChange={handleChange}
            required
          />

          <label className="signup-label">Email</label>
          <input
            name="email"
            type="email"
            className="signup-input"
            onChange={handleChange}
            required
          />

          <label className="signup-label">Password</label>
          <input
            name="password"
            type="password"
            className="signup-input"
            onChange={handleChange}
            required
          />

          <label className="signup-label">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            className="signup-input"
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <p className="signup-switch">
          Already have an account? <a href="/login">Login</a>
        </p>

      </div>
    </div>
  );
}
