import React, { useState } from "react";
import { host } from "../config/general";
import axios from "axios";

export default function SingUp(props) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [confirmPass, setConfirmPass] = useState(true);
  const [alert, setAlert] = useState("");

  const handleSubmit = (e) => {
    const { name, email, password, confirmPassword } = user;
    e.preventDefault();

    axios
      .post(`${host}/api/v1/users/signup`, {
        name,
        email,
        password,
        confirmPassword,
      })
      .then((res) => {
        props.signUp();
      })
      .catch((error) => {
        // console.log(error.response); //this is how we get the res.json({...}) from the server
        setAlert("There was an issue creating the account. Try again later");
      });
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
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              type="email"
              required
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <br />
            <input
              id="password"
              type="password"
              required
              onChange={(e) => {
                if (user.confirmPassword !== "") {
                  e.target.value === user.confirmPassword
                    ? setConfirmPass(true)
                    : setConfirmPass(false);
                }
                setUser({ ...user, password: e.target.value });
              }}
            />
          </div>
          <div>
            <label htmlFor="confirmpassword">Confirm password</label>
            <br />
            <input
              id="confirmpassword"
              type="password"
              required
              onChange={(e) => {
                e.target.value === user.password
                  ? setConfirmPass(true)
                  : setConfirmPass(false);
                setUser({ ...user, confirmPassword: e.target.value });
              }}
            />
          </div>
          {!confirmPass && <p className="warning">Must be same as password</p>}
          {alert && <p className="warning">{alert}</p>}
        </div>
        <button className="button">Sign up</button>
      </form>
    </div>
  );
}
