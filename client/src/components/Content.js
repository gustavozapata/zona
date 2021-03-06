import React, { Component } from "react";
import { host } from "../config/general";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_CogdxAKAHr92wKw0l8oobdtn00caDLPy1Y");
axios.defaults.withCredentials = true;

export class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
    };
  }

  add_comment = [];

  componentDidMount() {
    this.getAll();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.postAdded !== this.props.postAdded) {
      this.getAll();
    }
  }

  async getAll() {
    this.setState({
      isLoading: true,
    });
    await axios
      // .get(`${host}/api/v1/posts`, { headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // })
      //TODO: THE ABOVE IS REPLACED BY THE BELOW (SINCE USING COOKIES TO STORE JWT)
      .get(`${host}/api/v1/posts`)
      .then((res) => {
        this.setState({
          data: res.data.data.data.reverse(),
          isLoading: false,
        });
      })
      .catch(() => {
        this.props.notLoggedIn();
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
    axios.delete(`${host}/api/v1/posts/${id}`).then(() => {
      this.getAll();
    });
  }

  likePost(id, likes, reaction) {
    axios
      .patch(`${host}/api/v1/posts/${id}/like`, { reaction })
      .then((res) => {
        if (reaction === "love") {
          //TODO: MAKE THIS BETTER FOR SMOOTH UPDATE
        }
        this.getAll(); //TODO: MAKE THIS BETTER FOR SMOOTH UPDATE
      })
      .catch((err) => console.log("my error: ", err));
  }

  postComment(id, comment) {
    axios
      .patch(`${host}/api/v1/posts/${id}/comment`, {
        user: this.props.user,
        comment,
      })
      .then((res) => {
        this.getAll();
      })
      .catch((err) => console.log("Zona error: ", err));
  }

  async buyPost(id) {
    try {
      //1. get checkout session from backend
      const session = await axios(`${host}/api/v1/posts/buy-post/${id}`);

      //2. create a checkout form + charge credit card
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
    } catch (err) {
      console.log(err);
    }
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

              {/* buy post */}
              {post.price && (
                <div className="price">
                  <p>
                    <span onClick={() => this.buyPost(post._id)}>Buy post</span>{" "}
                    ${post.price}
                  </p>
                </div>
              )}

              {/* description */}
              <p className="post-description">{post.description}</p>

              {/* geolocation */}
              {post.geolocation.coordinates && (
                <div
                  data-locations={JSON.stringify(post.geolocation.coordinates)}
                ></div>
              )}

              {/* add comment */}
              <div className="comments">
                <div className="user-add-comment">
                  <img
                    src={require(`../images/users/${this.props.user.toLowerCase()}.png`)}
                    alt={this.props.user}
                  />
                  <textarea
                    value={this.add_comment[i]}
                    onChange={(e) => {
                      this.add_comment[i] = e.target.value;
                      this.setState({
                        comment: e.target.value,
                      });
                    }}
                    onFocus={(e) => {
                      e.target.className = "comment-active";
                    }}
                    onBlur={(e) => {
                      if (this.add_comment[i] === "") {
                        e.target.className = "";
                      }
                    }}
                    placeholder="Add a comment..."
                  ></textarea>
                  {this.add_comment && (
                    <span
                      onClick={() => {
                        this.postComment(post._id, this.add_comment[i]);
                        this.add_comment[i] = "";
                      }}
                      className="post-comment"
                      style={{
                        visibility:
                          this.add_comment[i] && this.add_comment[i].length > 0
                            ? "visible"
                            : "hidden",
                      }}
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
