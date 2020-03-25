import React from 'react';
import './header.scss';

function Header() {
    return (
        <header>
            <div>LOGO</div>
            <input id="country-searchbar" placeholder="Rechercher un pays"></input>
            <div />
        </header>
    );
}

export default Header;
