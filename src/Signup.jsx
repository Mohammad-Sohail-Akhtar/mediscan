import React, { useState } from "react";
import "./Login.css"; // use same CSS styling
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import banner from './images/imagebanner.jpg'

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
      });

      toast.success("Account Created!");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      console.log("FIRESTORE ERROR:", err);
      toast.error(err.message);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">

        {/* LEFT SIDE IMAGE */}
        <div className="login-left">
          <img
            src={banner}
            alt="Signup visual"
            className="left-img"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="login-right">
          <h2 className="auth-title">Sign Up</h2>

          <form onSubmit={handleSignup} className="auth-form">
            <input
              type="text"
              placeholder="Full Name"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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

            <input
              type="password"
              placeholder="Confirm Password"
              className="auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="auth-btn">
              Sign Up
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <span className="switch-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
