// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (selectedUser === "admin") {
      navigate("/admin-home");
    } else if (selectedUser === "test") {
      navigate("/test-user");
    } else {
      alert("Please select a user type!");
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <label>
          <input
            type="radio"
            name="userType"
            value="admin"
            onChange={(e) => setSelectedUser(e.target.value)}
          />
          Admin
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="userType"
            value="test"
            onChange={(e) => setSelectedUser(e.target.value)}
          />
          Test User
        </label>
        <br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
