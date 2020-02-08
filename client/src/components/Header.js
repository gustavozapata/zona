import React from 'react';
import Button from './Button'

export default function Header() {
    return (
        <div className="Header">
            <header>
                <h1>Zona</h1>
                <Button label='New' />
            </header>
        </div>
    )
}
