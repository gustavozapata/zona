import React, { Component } from "react";

import Header from "./Header";
import SideBar from "./SideBar";
import Content from "./Content";
import Footer from "./Footer";

export class Feed extends Component {
  render() {
    return (
      <div className="Feed">
        <Header showFeed={this.props.showFeed} />
        <Content />
        <SideBar />
        <Footer />
      </div>
    );
  }
}

export default Feed;
