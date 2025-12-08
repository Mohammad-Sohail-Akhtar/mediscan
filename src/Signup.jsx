// import React, { useState } from "react";
// // import './Signup.css';
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./Firebase";

// export default function Signup({ switchPage }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     try {
//       const user = await createUserWithEmailAndPassword(auth, email, password);
//       alert("Account created successfully!");
//       console.log("User created:", user.user);
//       switchPage(); // back to login
//     } catch (err) {
//       alert(err.message);
//     }
//   };
 
//   return (
//     <div className="auth-card">
//       <h2 className="auth-title">Sign Up</h2>
//       <form onSubmit={handleSignup} className="auth-form">
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
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="auth-input"
//           required
//         />
//         <button type="submit" className="auth-btn">Sign Up</button>
//       </form>

//       <p className="auth-switch">
//         Already have an account?{" "}
//         <span onClick={switchPage}>Login</span>
//       </p>
//     </div>
//   );
// }








// import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "./Firebase";
// import { doc, setDoc } from "firebase/firestore";

// export default function Signup({ switchPage }) {
//   const [name, setName] = useState("");  // new field
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//       // Save user info in Firestore
//       await setDoc(doc(db, "users", userCredential.user.uid), {
//         name: name,
//         email: email
//       });

//       alert("Account created successfully!");
//       switchPage();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="auth-card">
//       <h2 className="auth-title">Sign Up</h2>

//       <form onSubmit={handleSignup} className="auth-form">
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="auth-input"
//           required
//         />

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

//         <input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="auth-input"
//           required
//         />

//         <button type="submit" className="auth-btn">Sign Up</button>
//       </form>

//       <p className="auth-switch">
//         Already have an account? <span onClick={switchPage}>Login</span>
//       </p>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "./Firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// export default function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//       // Save user info in Firestore
//       await setDoc(doc(db, "users", userCredential.user.uid), {
//         name: name,
//         email: email
//       });

//       alert("Account created successfully!");
//       navigate("/login"); // navigate to login after signup
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="auth-card">
//       <h2 className="auth-title">Sign Up</h2>
//       <form onSubmit={handleSignup} className="auth-form">
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="auth-input"
//           required
//         />
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
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="auth-input"
//           required
//         />
//         <button type="submit" className="auth-btn">Sign Up</button>
//       </form>

//       <p className="auth-switch">
//         Already have an account?{" "}
//         <span
//           style={{ cursor: "pointer", color: "blue" }}
//           onClick={() => navigate("/login")}
//         >
//           Login
//         </span>
//       </p>
//     </div>
//   );
// }







import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";   

export default function Signup() {
  const [name, setName] = useState(""); // Full Name
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
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCredential.user.uid), {
    name,
    email
  });

  toast.success("Account Created")
  setName("");
  setEmail("");
  setPassword("");
  setConfirmPassword("");
  

  setTimeout(() => {
    navigate("/login");
  }, 800);

} catch (err) {
  console.log("FIRESTORE ERROR:", err);
  toast.error(err.message);
}


    
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Sign Up</h2>

      <form onSubmit={handleSignup} className="auth-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="auth-input"
          required
        />

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
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
