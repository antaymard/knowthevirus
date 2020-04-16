import React, { useState } from "react";
import CountryItem from "../countryItem/CountryItem";
import SearchIcon from "../icons/SearchIcon";
import "./countryPanel.scss";
import axios from "axios";
import { useEffect } from "react";
import randomColor from "randomcolor";

var timer = null;
var colorChosen = [];

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
      const colory = [
        "#ff5e33",
        "#ff3333",
        "#ffdb28",
        "#76da23",
        "#2bf3b1",
        "#22f8f5",
        "#d122f8",
        "#f988bb",
        "#ffffff",
      ];
      var b = false;
      var color = "";
      while (b == false) {
        var i = Math.floor(Math.random() * 8);
        var color = colory[i];
        if (colorChosen.includes(color) == false) {
          b = true;
          colorChosen.push(color);
        }
      }
      console.log(colorChosen);
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
