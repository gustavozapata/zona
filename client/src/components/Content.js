import React, { Component } from "react";
import axios from "axios";

export class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
      postLikes: []
    };
  }

  componentDidMount() {
    this.getAll();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.postAdded !== this.props.postAdded) {
      this.getAll();
    }
  }

  getAll() {
    this.setState({
      isLoading: true
    });
    axios
      .get("https://zona-server.herokuapp.com/api/v1/posts")
      .then(res => {
        this.setState({
          data: res.data.data.posts.reverse(),
          isLoading: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  delete(id) {
    axios
      .delete(`https://zona-server.herokuapp.com/api/v1/posts/${id}`)
      .then(() => {
        this.getAll();
      });
  }

  likePost(id, likes) {
    axios
      .patch(`https://zona-server.herokuapp.com/api/v1/posts/${id}`, { likes })
      .then(res => {
        this.setState({
          postLikes: res.data.data
        });
        this.getAll();
      })
      .catch(err => console.log("my error: ", err));
  }

  render() {
    return (
      <div className="Content">
        {this.state.isLoading && (
          <img
            style={{ width: "300px" }}
            src={require("../images/loading.gif")}
            alt="loading gif"
          />
        )}
        {this.state.data.map((post, i) => {
          return (
            <div className="post" key={i}>
              <h3>{post.location}</h3>
              <div className="profile-pic">
                <img
                  src={require(`../images/users/${post.by.toLowerCase()}.png`)}
                  alt={post.by}
                />
                <p>{post.date}</p>
              </div>
              <img
                className="post-pic"
                src={require(`../images/posts/${post.image}`)}
                alt={post.location}
              />
              <br />
              <p>{post.description}</p>
              <span
                style={{
                  color: "green",
                  float: "left",
                  fontSize: ".7em",
                  cursor: "pointer"
                }}
                onClick={() => this.delete(post._id)}
              >
                del
              </span>
              <button
                className="check"
                onClick={() => this.likePost(post._id, post.likes)}
              ></button>
              {post.likes < 1 ? "" : post.likes}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Content;
