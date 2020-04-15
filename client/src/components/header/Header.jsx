import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="header-section">
        <Link to="/">LOGO</Link>
        <input id="country-searchbar" placeholder="Rechercher un pays"></input>
        <Link to="/simulation">Simulation de l'épidémie</Link>
      </div>
    </header>
  );
}

export default Header;
