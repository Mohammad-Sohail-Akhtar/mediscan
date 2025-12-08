import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <Login switchPage={() => setIsLogin(false)} />
      ) : (
        <Signup switchPage={() => setIsLogin(true)} />
      )}
    </div>
  );
}
