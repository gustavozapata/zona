import React, { Component } from "react";
import axios from "axios";

export class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: []
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
      .get("http://localhost:4000/api/v1/posts")
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
    axios.delete(`http://localhost:4000/api/v1/posts/${id}`).then(() => {
      this.getAll();
    });
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
        {this.state.data.map((post, i) => (
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
            <button
              className="check"
              onClick={() => this.delete(post._id)}
            ></button>
          </div>
        ))}
      </div>
    );
  }
}

export default Content;
