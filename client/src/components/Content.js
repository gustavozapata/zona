import React, { Component } from 'react'

export class Content extends Component {

    state = {
        posts: [
            {
                id: 1,
                title: 'Silicon Valley',
                image: 'sv.jpeg',
                by: 'gustavozapata',
                date: 'Aug 12th'
            },
            {
                id: 2,
                title: 'Intel San Jose, CA',
                image: 'sj.jpeg',
                by: 'gustavozapata',
                date: 'Sep 24th'
            },
            {
                id: 3,
                title: 'iPhone 11 Pro',
                image: 'iphone.jpeg',
                by: 'gustavozapata',
                date: 'Oct 2nd'
            }
        ]
    }

    render() {
        return (
            <div className="Content">
                {this.state.posts.map(post => (
                    <div className="post" key={post.id}>
                        <h3>{post.title}</h3>
                        <div className='profile-pic'>
                            <img src={require(`../images/${post.by}.png`)} alt={post.by} />
                            <p>{post.date}</p>
                        </div>
                        <img src={require(`../images/${post.image}`)} alt={post.title} /><br />
                        <button className='check'></button>
                    </div>
                ))}
            </div>
        )
    }
}

export default Content
