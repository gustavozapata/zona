import React, { Component } from 'react'

export class SideBar extends Component {

    state = {
        navLinks: [
            {
                id: 1,
                name: "Home",
                icon: "home_g.png",
                active: true
            },
            {
                id: 2,
                name: "Groups",
                icon: "groups_g.png",
                active: false
            },
            {
                id: 3,
                name: "Settings",
                icon: "settings_g.png",
                active: false
            }
        ]
    }

    hoverImage = (id) => {
        let arr = this.state.navLinks
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
                arr[i].icon = arr[i].name.toLowerCase() + '.png'
            }
        }
        this.updateState(arr)
    }

    leaveImage = (id) => {
        let arr = this.state.navLinks
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
                arr[i].icon = arr[i].name.toLowerCase() + '_g.png'
            }
        }
        this.updateState(arr)
    }

    updateState = (arr) => {
        this.setState({
            navLinks: arr
        })
    }

    render() {
        return (
            <div className="SideBar">
                <div>
                    <ul>
                        {this.state.navLinks.map(nav => (
                            <li
                                key={nav.id}
                                className={nav.active ? 'active' : null}
                                onMouseOver={() => this.hoverImage(nav.id)}
                                onMouseOut={() => this.leaveImage(nav.id)} >
                                <img
                                    src={require(`../images/icons/${nav.active ? nav.name.toLowerCase() + '.png' : nav.icon}`)}
                                    alt={nav.name} />
                                {nav.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default SideBar
