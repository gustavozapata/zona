import React, { useState } from "react";
import axios from "axios";

export default function SingUp(props) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [confirmPass, setConfirmPass] = useState(true);

  const handleSubmit = e => {
    const { name, email, password } = user;
    e.preventDefault();

    axios
      .post("http://localhost:4000/api/v1/users", { name, email, password })
      .then(res => {
        props.signUp();
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="SignUp">
      <h1>Sign up</h1>
      <form className="elform" onSubmit={handleSubmit}>
        <div className="inputs">
          <div>
            <label htmlFor="name">Name</label>
            <br />
            <input
              id="name"
              type="text"
              required
              onChange={e => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              type="email"
              required
              onChange={e => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <br />
            <input
              id="password"
              type="password"
              required
              onChange={e => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="confirmpassword">Confirm password</label>
            <br />
            <input
              id="confirmpassword"
              type="password"
              required
              onChange={e => {
                e.target.value === user.password
                  ? setConfirmPass(true)
                  : setConfirmPass(false);
              }}
            />
          </div>
          {!confirmPass && (
            <p style={{ color: "red", marginTop: "-20px", fontSize: ".8em" }}>
              Must be same as password
            </p>
          )}
        </div>
        <button className="button">Sign up</button>
      </form>
    </div>
  );
}
