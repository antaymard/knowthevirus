import React from 'react';
import './header.css';

function Header() {
    return (
        <header>
            <div className="header-section">
                <div>LOGO</div>
                <input id="country-searchbar" placeholder="Rechercher un pays"></input>
                <div />
            </div>
        </header>
    );
}

export default Header;
