import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import './Authpage.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", user.user);
      alert("Login successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleLogin}>
          <label className="auth-label">Email</label>
          <input
            type="email"
            className="auth-input"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            className="auth-input"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn" type="submit">Login</button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>

      </div>
    </div>
  );
}
