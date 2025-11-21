import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./register.module.css";
import { useDispatch } from "react-redux";
import { register } from "../../redux/authSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState(false); // You can change this to hold a string message
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (confirmPass !== password) return;

    try {
      // USE THE ENVIRONMENT VARIABLE HERE
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/register`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      // BETTER ERROR HANDLING
      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg?.msg || "Registration failed");
      }

      const data = await res.json();
      dispatch(register(data));
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2500);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Register</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="username">
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              placeholder="Enter username"
            />
          </label>
          <label htmlFor="email">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Enter email"
            />
          </label>
          <label htmlFor="password">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="Enter password"
            />
          </label>
          <label htmlFor="confirmPass">
            <input
              onChange={(e) => setConfirmPass(e.target.value)}
              type="password"
              id="confirmPass"
              placeholder="Confirm password"
            />
          </label>
          <button className={classes.submitBtn}>Register</button>
          <Link to="/login">
            Already have an account? <p className={classes.login}>Login now</p>
          </Link>
        </form>
        {error && (
          <div className={classes.errorMessage}>
             Error! Check credentials or try again.
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;