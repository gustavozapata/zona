import React from "react";
import Button from "./Button";

export default function Header(props) {
  const styles = {
    userName: {
      position: "absolute",
      top: "30px",
      right: "40px",
      fontWeight: "bold",
      textDecoration: "underline",
      cursor: "pointer"
    }
  };

  const gzUI = async () => {
    await fetch("http://localhost:4000/api/v1/posts/stats")
      .then(res => res.json())
      .then(res => console.log(res));
  };

  return (
    <div className="Header">
      <header>
        <h1
          onClick={() => {
            window.location.reload();
          }}
        >
          Zona
        </h1>
        <p style={styles.userName} onClick={gzUI}>
          {props.user}
        </p>
        <Button label="New" show={props.user} showNewPost={props.showNewPost} />
      </header>
    </div>
  );
}
