import React, { useState } from "react";
import { host } from "../config/general";
import axios from "axios";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const resetPassword = async (email) => {
    try {
      await axios.post(`${host}/api/v1/users/forgotPassword`, {
        email,
      });
      setIsForgot(false);
    } catch (error) {
      console.log("GZ ", error);
    }
  };

  return (
    <div className="SignUp">
      <h1>{!isForgot ? "Log in" : "Reset password"}</h1>
      {isForgot && (
        <p>
          Enter your email address and we will send you a password reset link.
        </p>
      )}
      <form className="elform" action="">
        <div className="inputs">
          <div>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              type="email"
              onChange={handleEmailChange}
              value={email}
            />
          </div>
          {!isForgot && (
            <div>
              <label htmlFor="password">Password</label>
              <br />
              <input
                id="password"
                type="password"
                onChange={handlePasswordChange}
                value={password}
              />
            </div>
          )}
          {props.errorLogin && <p className="warning">{props.errorLogin}</p>}
        </div>
        {!isForgot ? (
          <button
            className="button btn-loading"
            onClick={(e) => {
              e.preventDefault();
              props.login(email, password);
            }}
          >
            {props.isLoading ? (
              <img
                id="spinner"
                src={require("../images/spinner.gif")}
                alt="Loading"
              />
            ) : (
              "Log in"
            )}
          </button>
        ) : (
          <button
            className="button"
            onClick={(e) => {
              e.preventDefault();
              resetPassword(email);
            }}
          >
            Reset
          </button>
        )}
        <a id="forgot-password" onClick={() => setIsForgot(true)}>
          {!isForgot ? "Forgot password?" : ""}
        </a>
      </form>
    </div>
  );
}
