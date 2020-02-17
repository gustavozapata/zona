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
        <p style={styles.userName}>{props.user}</p>
        <Button label="New" show={props.user} />
      </header>
    </div>
  );
}
