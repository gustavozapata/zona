import React, { useState } from "react";
import Button from "./Button";
import { userMenu } from "../content/userMenu";

export default function Header(props) {
  const [showMenu, setShowMenu] = useState(false);

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

  const showOrHide = () => {
    return {
      display: showMenu ? "block" : "none"
    };
  };

  const renderMenu = () => {
    return (
      <div className="btn-menu" style={showOrHide()}>
        <ul>
          {userMenu.map(item => (
            <li
              key={item.id}
              onClick={
                item.label === "Log out"
                  ? () => {
                      setShowMenu(false);
                      props.logout();
                    }
                  : undefined
              }
            >
              <img
                src={require(`../images/icons/${item.image}`)}
                alt={item.label}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    );
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
        <p style={styles.userName} onClick={() => setShowMenu(!showMenu)}>
          {props.user}
        </p>
        <div style={{ position: "absolute", top: "-8px", right: "180px" }}>
          {renderMenu()}
        </div>
        <Button label="New" show={props.user} showNewPost={props.showNewPost} />
      </header>
    </div>
  );
}
