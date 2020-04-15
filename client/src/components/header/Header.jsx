import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { Link } from "react-router-dom";
//import img from "../../image/virus.jpg";

function Header() {
  return (
    <header>
      <div className="header-section">
        <Link to="/">KNOWTHEVIRUS</Link>
        {/* <img className="logo" src={img} alt="" /> */}
        {/* <input id="country-searchbar" placeholder="Rechercher un pays"></input> */}
        <div />
      </div>
    </header>
  );
}

export default Header;
