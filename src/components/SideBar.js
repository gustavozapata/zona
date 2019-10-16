import React, { Component } from 'react'
// import { menuItems } from '../content/sideBarContent'
import { menuItems } from '../content/spanish/sideBarContent'

const { HOME, GROUPS, SETTINGS } = menuItems;

export class SideBar extends Component {

    state = {
        navLinks: [
            {
                id: 1,
                name: 'home',
                label: HOME,
                image: "home_g.png",
                active: true
            },
            {
                id: 2,
                name: 'groups',
                label: GROUPS,
                image: "groups_g.png",
                active: false
            },
            {
                id: 3,
                name: 'settings',
                label: SETTINGS,
                image: "settings_g.png",
                active: false
            }
        ]
    }

    hoverImage = (id, letter = '') => {
        this.setState(state => {
            const list = state.navLinks.map((item, index) => {
                if (index === id) {
                    return item.image = item.name + `${letter}.png`
                } else {
                    return item
                }
            });
            return {
                list
            };
        });
    }

    render() {
        return (
            <div className="SideBar">
                <div>
                    <ul>
                        {this.state.navLinks.map((nav, index) => (
                            <li
                                key={nav.id}
                                className={nav.active ? 'active' : null}
                                onMouseOver={() => this.hoverImage(index)}
                                onMouseOut={() => this.hoverImage(index, '_g')} >
                                <img
                                    src={require(`../images/icons/${nav.active ? nav.name + '.png' : nav.image}`)}
                                    alt={nav.name} />
                                {nav.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default SideBar