import React from "react";
import Button from "./Button";

export default function Header(props) {
  return (
    <div className="Header">
      <header>
        <h1>Zona</h1>
        <Button label="New" showFeed={props.showFeed} />
      </header>
    </div>
  );
}
