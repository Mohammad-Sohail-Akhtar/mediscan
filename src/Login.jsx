import React, { useState } from "react";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import banner from './images/imagebanner.jpg'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successfully");
      navigate("/app/scanner");
    } catch (err) {
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
            alt="Login visual"
            className="left-img"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="login-right">
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

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account?{" "}
            <span className="switch-link" onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
