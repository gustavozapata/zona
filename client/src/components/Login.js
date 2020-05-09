import React, { useState } from "react";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="SignUp">
      <h1>Log in</h1>
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
          {props.errorLogin && <p className="warning">{props.errorLogin}</p>}
        </div>
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
      </form>
    </div>
  );
}
