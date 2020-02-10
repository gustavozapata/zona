import React from "react";

export default function SingUp() {
  return (
    <div className="SignUp">
      <h1>Sign up</h1>
      <form className="elform" action="">
        <div className="inputs">
          <div>
            <label htmlFor="name">Name</label>
            <br />
            <input id="name" type="text" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <br />
            <input id="email" type="email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <br />
            <input id="password" type="password" />
          </div>
          <div>
            <label htmlFor="confirmpassword">Confirm password</label>
            <br />
            <input id="confirmpassword" type="password" />
          </div>
        </div>
        <button className="button">Sign up</button>
      </form>
    </div>
  );
}
