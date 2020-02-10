import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import Header from "./components/Header";
import Login from "./components/Login";
import SignUp from "./components/SingUp";
import Feed from "./components/Feed";
import Footer from "./components/Footer";

import "./App.css";

let theCode = "";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/login")
      .then(res => console.log(res.data));
  }, []);

  const enter = useRef();

  const checkCode = () => {
    if (code === "1234") {
      setShowSignup(true);
      theCode = "";
    }
  };

  const goNext = e => {
    theCode += e.target.value;
    if (e.target.id !== "last") {
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    } else {
      enter.current.focus();
      setCode(theCode);
    }
  };

  const checkLogin = (email, password) => {
    axios
      .post("http://localhost:4000/api/v1/login", { email, password })
      .then(res => {
        if (res.data.logged) {
          setIsLogged(true);
          setShowLogin(false);
        }
      });
  };

  return (
    <div className="App">
      <Header />
      {isLogged ? (
        <Feed />
      ) : (
        <>
          {!showSignup ? (
            <main>
              <h1>
                Welcome to
                <br />
                Zona
              </h1>
              {showLogin ? (
                <Login login={checkLogin} />
              ) : (
                <div className="invite-code">
                  <form action="">
                    <input type="text" onChange={goNext} />
                    <input type="text" onChange={goNext} />
                    <input type="text" onChange={goNext} />
                    <input id="last" type="text" onChange={goNext} />
                  </form>
                  <p>Please enter the invitation code</p>
                  <button className="button" ref={enter} onClick={checkCode}>
                    Enter
                  </button>
                  <p className="have-account">
                    Have an account?{" "}
                    <span onClick={() => setShowLogin(true)}>Log in</span>
                  </p>
                </div>
              )}
            </main>
          ) : (
            <SignUp />
          )}
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;
