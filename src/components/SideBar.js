import React, { Component } from 'react'

export class SideBar extends Component {
    render() {
        return (
            <div className="SideBar">
                <h2>Side Bar</h2>
                <ul>
                    <li>Home</li>
                    <li>Groups</li>
                    <li>Settings</li>
                </ul>
            </div>
        )
    }
}

export default SideBar
