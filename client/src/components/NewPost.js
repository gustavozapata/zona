import React, { useState, useRef } from "react";
import { host } from "../config/general";
import axios from "axios";

axios.defaults.withCredentials = true;

let fileName = "";

export default function NewPost(props) {
  const [file, setFile] = useState([]);
  const [isImageChosen, setIsImageChosen] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loadingBar, setLoadingBar] = useState(0);

  const fileRef = useRef();

  const chooseFile = () => {
    fileRef.current.click();
  };

  const handleChange = () => {
    setFile([...fileRef.current.files]);
    setIsImageChosen(true);
  };

  const returnFileSize = (number) => {
    if (number < 1024) {
      return number + "bytes";
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + "KB";
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(1) + "MB";
    }
  };

  const post = async (e) => {
    setLoadingBar(10);
    e.persist();
    e.preventDefault();
    if (isImageChosen) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      fileName = `post-${Date.now()}.${file[0].type.split("/")[1]}`;
      try {
        await axios.post(`${host}/api/v1/posts`, {
          description,
          image: fileName,
          by: props.user,
          location,
          geolocation: {
            coordinates: [0, 0],
          },
          date: new Date().toLocaleDateString("en-US", options),
        });
        //if the above success, run the two lines below
        setLoadingBar(50);
        saveImage(e);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const saveImage = async (e) => {
    setLoadingBar(100);
    e.preventDefault();
    const formData = new FormData();
    formData.append("postImage", file[0], fileName);
    try {
      await axios
        .post("https://server.gustavozapata.me/zona/storage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          props.closeNewPost();
          setTimeout(() => {
            props.addPost();
            axios.post(`${host}/api/v1/posts/notify`, { by: props.user });
          }, 1000);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const back = (e) => {
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
        <form action="" onSubmit={post}>
          <div className="choose-image">
            {!isImageChosen && <h3>Choose an image</h3>}
            {isImageChosen ? (
              <div className="post-container">
                <div>
                  <img
                    id="file-preview"
                    src={URL.createObjectURL(file[0])}
                    alt="Preview post"
                  />
                  <p id="file-name">
                    {file[0].name}
                    <br />
                    {returnFileSize(file[0].size)}
                  </p>
                </div>
                <div className="info-post">
                  <label htmlFor="location">Location</label>
                  <br />
                  <input
                    id="location"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <br />
                  <br />
                  <label htmlFor="description">Description</label>
                  <br />
                  <textarea
                    id="description"
                    cols="30"
                    rows="10"
                    required
                    maxLength="150"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  <br />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <span onClick={chooseFile}>
                    <img
                      src={require("../images/icons/image.png")}
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
          <button className="post-btn" hidden={isImageChosen ? false : true}>
            Post
          </button>
        </form>
        {loadingBar > 0 && (
          <div id="loading-bar" style={{ width: `${loadingBar}%` }}></div>
        )}
      </div>
    </div>
  );
}
