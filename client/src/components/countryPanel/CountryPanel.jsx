import React, { useState } from "react";
import CountryItem from "../countryItem/CountryItem";
import SearchIcon from "../icons/SearchIcon";
import "./countryPanel.scss";
import axios from "axios";
import { useEffect } from "react";

var timer = null;

function CountryPanel(props) {
  const [countrySearch, setCountrySearch] = useState("");
  const [countrySuggests, setCountrySuggests] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    if (countrySearch.length === 0) {
      setCountrySuggests([]);
    }
  }, [countrySearch]);

  useEffect(() => {
    console.log("effect fired");
    props.sendSelectedCountries(selectedCountries);
  }, [selectedCountries]);

  useEffect(() => {
    addToSelectedCountries("France");
  }, []);

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
    if (selectedCountries.filter((el) => el.country === country).length === 0) {
      let s = [...selectedCountries];
      var randomColor = require("randomcolor");
      var color = randomColor();
      s.push({
        country: country,
        color: color,
      });
      setSelectedCountries(s);
      setCountrySearch("");
    }
  };
  const removeFromSelectedCountries = (country) => {
    setSelectedCountries(
      selectedCountries.filter((e) => e.country !== country)
    );
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
          country={item.country}
          color={item.color}
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
