import React, { useState } from "react";
import CountryItem from "../countryItem/CountryItem";
import SearchIcon from "../icons/SearchIcon";
import "./countryPanel.scss";
import axios from "axios";
import { useEffect } from "react";

var timer = null;

function CountryPanel() {
  const [countrySearch, setCountrySearch] = useState("");
  const [countrySuggests, setCountrySuggests] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    if (countrySearch.length === 0) {
      setCountrySuggests([]);
    }
  }, [countrySearch]);

  const getSuggestions = (search) => {
    if (search.length > 0) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("search launched");
        axios.get("/api/search_countries?search=" + search).then((res) => {
          if (res.data.success) {
            console.log(res);
            setCountrySuggests(res.data.data);
          } else {
            console.log(res.data.error);
          }
        });
      }, 600);
    }
  };

  const onCountrySearchChange = (e) => {
    setCountrySearch(e.target.value);
    getSuggestions(e.target.value);
  };

  const addToSelectedCountries = (country) => {
    if (selectedCountries.indexOf(country) < 0) {
      selectedCountries.push(country);
      setCountrySearch("");
    }
  };
  const removeFromSelectedCountries = (country) => {
    if (selectedCountries.indexOf(country) > -1) {
      setSelectedCountries(selectedCountries.filter((e) => e !== country));
    }
  };

  const renderSuggestions = () => {
    if (countrySuggests) {
      return (
        <div className="country-suggests-container">
          {countrySuggests.map((item, i) => {
            return (
              <div
                key={item}
                className="country-suggests-item"
                onClick={() => addToSelectedCountries(item)}
              >
                {item}
              </div>
            );
          })}
        </div>
      );
    }
  };

  const renderSelectedCountries = () => {
    return selectedCountries.map((item, i) => {
      return (
        <CountryItem
          country={item}
          key={i}
          remove={removeFromSelectedCountries}
        />
      );
    });
  };

  return (
    <div className=" card country-panel-body">
      <div className="header">
        <SearchIcon />
        <input
          placeholder="Ajouter un pays au graphique"
          onChange={onCountrySearchChange}
          value={countrySearch}
        />
        <button className="clean-search" onClick={() => setCountrySearch("")}>
          X
        </button>
        {renderSuggestions()}
      </div>
      <div className="list-section">{renderSelectedCountries()}</div>
    </div>
  );
}

export default CountryPanel;
