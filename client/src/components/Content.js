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

  getAll() {
    this.setState({
      isLoading: true
    });
    axios
      .get("http://localhost:4000/api/v1/posts")
      .then(res => {
        this.setState({
          data: res.data.data.posts,
          isLoading: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // writeAll() {
  //   axios.post("http://localhost:4000/api/v1/products").then(res => {
  //     this.getAll();
  //     console.log(res.data.description);
  //   });
  // }

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
        {/* <button onClick={() => this.writeAll()}>Write</button> */}
        {this.state.data.map(post => (
          <div className="post" key={post.id}>
            <h3>{post.title}</h3>
            <div className="profile-pic">
              <img src={require(`../images/${post.by}.png`)} alt={post.by} />
              <p>{post.date}</p>
            </div>
            <img src={require(`../images/${post.image}`)} alt={post.title} />
            <br />
            <p>{post.location}</p>
            <button className="check"></button>
          </div>
        ))}
      </div>
    );
  }
}

export default Content;
