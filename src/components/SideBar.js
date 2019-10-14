import React, { Component } from 'react'

export class SideBar extends Component {
    render() {
        return (
            <div className="SideBar">
                <h2>Menu</h2>
                <div>
                    <ul>
                        <li>Home</li>
                        <li>Groups</li>
                        <li>Settings</li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default SideBar
