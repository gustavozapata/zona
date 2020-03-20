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
  const [wrongLogin, setWrongLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [user, setUser] = useState("");

  const enter = useRef();

  useEffect(() => {
    setIsLogged(localStorage.getItem("isLogged"));
    setUser(localStorage.getItem("user"));
  }, []);

  const checkCode = () => {
    axios
      .post("https://zona-server.herokuapp.com/api/v1/users/invitation", {
        code
      })
      .then(res => {
        if (res.data.data) {
          setShowSignup(true);
          theCode = "";
        }
      });
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
    setIsLoading(true);
    axios
      .post("https://zona-server.herokuapp.com/api/v1/users/login", {
        email,
        password
      })
      .then(res => {
        if (res.data.logged) {
          localStorage.setItem("isLogged", true);
          localStorage.setItem("user", res.data.user);
          setShowLogin(false);
          setIsLogged(localStorage.getItem("isLogged"));
          setUser(localStorage.getItem("user"));
          setIsLoading(false);
        } else {
          setWrongLogin(true);
          setIsLoading(false);
        }
      });
  };

  const signUp = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const logout = () => {
    gzUI();
    localStorage.setItem("user", "");
    localStorage.setItem("isLogged", "");
    setIsLogged(false);
    setUser("");
  };

  const openNewPost = () => {
    setShowNewPost(true);
  };

  const closeNewPost = () => {
    setShowNewPost(false);
  };

  //USING MY (GZ) NPM PACKAGE
  const gzUI = async () => {
    await fetch("https://zona-server.herokuapp.com/api/v1/posts/stats")
      .then(res => res.json())
      .then(res => console.log(res));
  };

  return (
    <div className="App">
      <Header user={user} showNewPost={openNewPost} logout={logout} />
      {isLogged ? (
        <Feed
          user={user}
          showNewPost={showNewPost}
          closeNewPost={closeNewPost}
        />
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
                <Login
                  login={checkLogin}
                  wrongLogin={wrongLogin}
                  isLoading={isLoading}
                />
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
                    <br />
                    Have an account?{" "}
                    <span onClick={() => setShowLogin(true)}>Log in</span>
                  </p>
                </div>
              )}
            </main>
          ) : (
            <SignUp signUp={signUp} />
          )}
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;
