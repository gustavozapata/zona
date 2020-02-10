import React, { Component } from "react";

// import SideBar from "./SideBar";
import Content from "./Content";

export class Feed extends Component {
  render() {
    return (
      <div className="Feed">
        <Content />
        {/* <SideBar /> */}
      </div>
    );
  }
}

export default Feed;
