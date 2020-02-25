import React, { useState, useRef } from "react";
import axios from "axios";

export default function NewPost(props) {
  const [file, setFile] = useState([]);
  const [isImageChosen, setIsImageChosen] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const fileRef = useRef();
  const camRef = useRef();

  const chooseFile = () => {
    fileRef.current.click();
  };

  const handleChange = () => {
    setFile([...fileRef.current.files]);
    setIsImageChosen(true);
  };

  const returnFileSize = number => {
    if (number < 1024) {
      return number + "bytes";
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + "KB";
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(1) + "MB";
    }
  };

  const post = e => {
    e.preventDefault();
    if (isImageChosen) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric"
      };
      axios
        .post("http://localhost:4000/api/v1/posts", {
          description,
          // image: file[0].name,
          image: "sj.jpeg",
          // imageData: "",
          by: props.user,
          location,
          date: new Date().toLocaleDateString("en-US", options)
        })
        .then(() => {
          props.closeNewPost();
          props.addPost();
        });
    }
  };

  const back = e => {
    e.preventDefault();
    setIsImageChosen(false);
  };

  return (
    <div className="NewPost">
      <div className="popup">
        <span className="close" onClick={props.closeNewPost}>
          <p>X</p>
        </span>
        <h2>New Post</h2>
        <form action="">
          <div className="choose-image">
            {!isImageChosen && <h3>Choose an image</h3>}
            {isImageChosen ? (
              <>
                <div>
                  <img
                    id="file-preview"
                    src={URL.createObjectURL(file[0])}
                    alt="Preview post"
                  />
                  <p id="file-name">
                    {file[0].name} {returnFileSize(file[0].size)}
                  </p>
                </div>
                <div className="info-post">
                  <label htmlFor="location">Location</label>
                  <br />
                  <input
                    type="text"
                    id="location"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                  <br />
                  <br />
                  <label htmlFor="description">Description</label>
                  <br />
                  <textarea
                    name="description"
                    id="description"
                    cols="30"
                    rows="10"
                    required
                    maxLength="150"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  ></textarea>
                  <br />
                </div>
              </>
            ) : (
              <>
                <div>
                  <span onClick={chooseFile}>
                    <img
                      src={require("../images/icons/folder.png")}
                      alt="Folder"
                    />
                  </span>
                  <br />
                  <input
                    ref={fileRef}
                    name="postImage"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <p onClick={chooseFile}>Choose file</p>
                </div>
                <div>
                  <span>
                    <img
                      src={require("../images/icons/camera.png")}
                      alt="Camera"
                    />
                  </span>
                  <br />
                  <input
                    ref={camRef}
                    type="file"
                    accept="image/*"
                    capture="camera"
                    hidden
                  />
                  <p>Take a picture</p>
                </div>
              </>
            )}
          </div>
          <button
            className="post-btn cancel-btn"
            onClick={back}
            hidden={isImageChosen ? false : true}
          >
            Back
          </button>
          <button
            className="post-btn"
            onClick={post}
            hidden={isImageChosen ? false : true}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
