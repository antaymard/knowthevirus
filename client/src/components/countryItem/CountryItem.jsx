import React from "react";

import "./countryItem.scss";

function CountryItem(props) {
  return (
    <div className="country-item-body">
      <div>
        <div className="pill" />
        {props.country}
      </div>
      <button onClick={() => props.remove(props.country)}>X</button>
    </div>
  );
}

export default CountryItem;
