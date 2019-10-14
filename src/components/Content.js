import React, { Component } from 'react'

export class Content extends Component {

    state = {
        posts: [
            {
                id: 1,
                title: 'Silicon Valley',
                image: 'sv.jpeg'
            },
            {
                id: 2,
                title: 'Intel San Jose, CA',
                image: 'sj.jpeg'
            },
            {
                id: 3,
                title: 'iPhone 11 Pro',
                image: 'iphone.jpeg'
            }
        ]
    }

    render() {
        return (
            <div className="Content">
                {this.state.posts.map(post => (
                    <div className="post">
                        <h3>{post.title}</h3>
                        <img src={require(`../images/${post.image}`)} alt={post.title} /><br />
                        <button>Like</button>
                        <button>Comment</button>
                    </div>
                ))}
            </div>
        )
    }
}

export default Content
