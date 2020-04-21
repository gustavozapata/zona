import React, { Component } from "react";

// import SideBar from "./SideBar";
import NewPost from "./NewPost";
import Content from "./Content";

export class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewPost: false,
      newPostAdded: false,
    };
  }

  closeNewPost = () => {
    this.setState({
      showNewPost: false,
    });
  };

  addPost = () => {
    this.setState({
      newPostAdded: true,
    });
  };

  render() {
    return (
      <div className="Feed">
        {this.props.showNewPost && (
          <NewPost
            closeNewPost={this.props.closeNewPost}
            user={this.props.user}
            addPost={this.addPost}
          />
        )}
        <Content
          postAdded={this.state.newPostAdded}
          user={this.props.user}
          userPhoto={this.props.userPhoto}
        />
        {/* <SideBar /> */}
      </div>
    );
  }
}

export default Feed;
