import React, { Component } from "react";
import axios from "axios";

export class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      comment: "",
      commentStyle: "",
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
    // <span
    //  style={{
    //  color: "green",
    //  float: "left",
    //  fontSize: ".7em",
    //  cursor: "pointer"
    // }}
    // onClick={() => this.delete(post._id)}
    // >
    //   del
    // </span>
    axios
      .delete(`https://zona-server.herokuapp.com/api/v1/posts/${id}`)
      .then(() => {
        this.getAll();
      });
  }

  likePost(id, likes, reaction) {
    axios
      .patch(`https://zona-server.herokuapp.com/api/v1/posts/likes/${id}`, {
        reaction,
        likes
      })
      .then(res => {
        if (reaction === "love") {
          //TODO: MAKE THIS BETTER FOR SMOOTH UPDATE
        }
        this.getAll(); //TODO: MAKE THIS BETTER FOR SMOOTH UPDATE
      })
      .catch(err => console.log("my error: ", err));
  }

  postComment(id) {
    axios
      .patch(`https://zona-server.herokuapp.com/api/v1/posts/comments/${id}`, {
        user: this.props.user,
        comment: this.state.comment
      })
      .then(res => {
        this.setState({
          comment: ""
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
                src={`https://server.gustavozapata.me/zona/public/${post.image}`}
                alt={post.location}
              />
              <br />
              <div className="reactions">
                <img
                  onClick={() => this.likePost(post._id, post.love, "love")}
                  src={require(`../images/icons/heart_${
                    post.love < 1 ? "e" : "f"
                  }.png`)}
                  alt="Love Heart icon"
                />
                <span>{post.love < 1 ? "" : post.love}</span>
                <img
                  onClick={() => this.likePost(post._id, post.funny, "funny")}
                  src={require(`../images/icons/lol_${
                    post.funny < 1 ? "e" : "f"
                  }.png`)}
                  alt="Funny Lol icon"
                />
                <span>{post.funny < 1 ? "" : post.funny}</span>
              </div>

              {/* description */}
              <p className="post-description">{post.description}</p>

              {/* add comment */}
              <div className="comments">
                <div className="user-add-comment">
                  <img
                    src={require(`../images/users/${this.props.user.toLowerCase()}.png`)}
                    alt={this.props.user}
                  />
                  <textarea
                    value={this.state.comment}
                    onChange={e => this.setState({ comment: e.target.value })}
                    onFocus={() =>
                      this.setState({
                        commentStyle: "comment-active"
                      })
                    }
                    onBlur={() =>
                      this.setState({
                        commentStyle: ""
                      })
                    }
                    className={this.state.commentStyle}
                    placeholder="Add a comment..."
                  ></textarea>
                  {this.state.comment && (
                    <span
                      onClick={() => this.postComment(post._id)}
                      className="post-comment"
                    >
                      Post
                      <img
                        src={require("../images/icons/post-comment.png")}
                        alt=""
                      />
                    </span>
                  )}
                  {/* comments */}
                  {post.comments.map((el, i) => (
                    <p key={i} className="user-comment">
                      <img
                        src={require(`../images/users/${el.user.toLowerCase()}.png`)}
                        alt={el.user}
                      />
                      <span>{el.user}</span> {el.comment}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Content;
