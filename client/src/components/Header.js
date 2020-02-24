import React, { useState } from "react";
import Button from "./Button";
import NewPost from "./NewPost";

export default function Header(props) {
  const [showNewPost, setShowNewPost] = useState(false);

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

  const Image = () => {
    setShowNewPost(true);
  };

  const closeNewPost = () => {
    setShowNewPost(false);
  };

  return (
    <div className="Header">
      {showNewPost && <NewPost closeNewPost={closeNewPost} user={props.user} />}
      <header>
        <h1
          onClick={() => {
            window.location.reload();
          }}
        >
          Zona
        </h1>
        <p style={styles.userName}>{props.user}</p>
        <Button label="New" show={props.user} showNewPost={Image} />
      </header>
    </div>
  );
}
