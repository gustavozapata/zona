import React, { Component } from "react";
import axios from "axios";

export class Content extends Component {
  // state = {
  //     posts: [
  //         {
  //             id: 1,
  //             title: 'Silicon Valley',
  //             image: 'sv.jpeg',
  //             by: 'gustavozapata',
  //             date: 'Aug 12th'
  //         },
  //         {
  //             id: 2,
  //             title: 'Intel San Jose, CA',
  //             image: 'sj.jpeg',
  //             by: 'gustavozapata',
  //             date: 'Sep 24th'
  //         },
  //         {
  //             id: 3,
  //             title: 'iPhone 11 Pro',
  //             image: 'iphone.jpeg',
  //             by: 'gustavozapata',
  //             date: 'Oct 2nd'
  //         }
  //     ]
  // }
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
      .get("http://localhost:4000/api/v1/products")
      .then(res => {
        console.log(res.data);
        this.setState({
          isLoading: false,
          data: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  writeAll() {
    this.setState({
      isLoading: true
    });
    axios.post("http://localhost:4000/api/v1/products").then(res => {
      this.getAll();
      console.log(res.data.description);
    });
  }

  render() {
    return (
      <div className="Content">
        <button onClick={() => this.writeAll()}>Write</button>
        {this.state.data.map(post => (
          <div className="post" key={post.id}>
            <h3>{post.title}</h3>
            <div className="profile-pic">
              <img src={require(`../images/${post.by}.png`)} alt={post.by} />
              <p>{post.date}</p>
            </div>
            <img src={require(`../images/${post.image}`)} alt={post.title} />
            <br />
            <button className="check"></button>
          </div>
        ))}
      </div>
    );
  }
}

export default Content;
