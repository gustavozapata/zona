import React, { useState } from "react";
import { items } from "../content/spanish/newItem";

export default function Button(props) {
  const [showMenu, setShowMenu] = useState(false);

  const renderMenu = () => {
    return (
      <div className="btn-menu" style={showOrHide()}>
        <ul>
          {items.map(item => (
            <li
              key={item.id}
              onClick={item.label === "Imagen" ? addPost : undefined}
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

  const showOrHide = () => {
    return {
      display: showMenu ? "block" : "none"
    };
  };

  const addPost = () => {
    props.showNewPost();
    setShowMenu(!showMenu);
  };

  return (
    <>
      {props.show !== "" && (
        <div
          className="Button"
          style={{ position: "absolute", top: "5px", left: "30px" }}
        >
          <button onClick={() => setShowMenu(!showMenu)}>{props.label}</button>

          {/* IF BUTTON HAS MENU, RENDER THE BELOW */}
          {renderMenu()}
        </div>
      )}
    </>
  );
}
