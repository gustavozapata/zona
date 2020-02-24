import React, { Component } from "react";

// import SideBar from "./SideBar";
import NewPost from "./NewPost";
import Content from "./Content";

export class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewPost: false,
      newPostAdded: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.showNewPost !== prevProps.showNewPost) {
      this.setState({
        showNewPost: this.props.showNewPost
      });
    }
  }

  openNewPost = () => {
    this.setState({
      showNewPost: true
    });
  };

  closeNewPost = () => {
    this.setState({
      showNewPost: false
    });
  };

  addPost = () => {
    this.setState({
      newPostAdded: true
    });
  };

  render() {
    return (
      <div className="Feed">
        {this.state.showNewPost && (
          <NewPost
            closeNewPost={this.closeNewPost}
            user={this.props.user}
            addPost={this.addPost}
          />
        )}
        <Content addPost={this.state.newPostAdded} />
        {/* <SideBar /> */}
      </div>
    );
  }
}

export default Feed;
