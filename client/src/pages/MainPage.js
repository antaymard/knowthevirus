import React, { useEffect, useState } from "react";
import queryString from "query-string";
import axios from "axios";

import CountryPanel from "../components/countryPanel/CountryPanel";
import "./mainPage.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function MainPage() {
  //window.addEventListener('resize', reportWindowSize);

  const [data, setData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    axios.post("/api/global_deaths", selectedCountries).then((res) => {
      const newArr = res.data.data.map((item) => {
        return {
          short_date: item.short_date,
          total_deaths: item.total_deaths,
          location: item.location,
        };
      });
      setData(newArr);
    });
  }, [selectedCountries]);

  const updateSelectedCountries = (countriesArray) => {
    console.log(countriesArray);
    setSelectedCountries(countriesArray);
  };

  return (
    <div className="main-page-body">
      <div className="main-page-section">
        <div className="left-part">
          <h1>Nombre de décès au COVID-19 (date relative)</h1>
          <p>
            Cette courbe permet de simuler une situation où tous les pays ont
            été contaminés en même temps. Elle permet de comparer l’évolution du
            virus, en ignorant les décalages de contamination ?? L’axe des dates
            correspond donc à des dates relatives (x jours après le 10e décès).
          </p>
        </div>
      </div>
      <div className="main-page-section">
        <div className="left-part">
          <div
            className="card"
            style={{ height: "600px", marginBottom: "20px" }}
          >
            <LineChart
              width={800}
              height={600}
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <XAxis dataKey="short_date" allowDuplicatedCategory={false} />
              <YAxis />
              {selectedCountries.map((item) => {
                var json = data.filter(function (a) {
                  if (a.total_deaths > 10) {
                    return a.location == item;
                  }
                });
                return (
                  <Line
                    type="monotone"
                    dataKey="total_deaths"
                    stroke="red"
                    data={json}
                  />
                );
              })}
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Tooltip />
            </LineChart>
          </div>
          <div className="card chart-settings-section">
            <div>
              Afficher
              <button className="mode-button">Décès</button>
              <button className="mode-button">Guérisons</button>
            </div>
            <div>
              Temps
              <button className="mode-button">Relatif</button>
              <button className="mode-button">Normal</button>
            </div>
          </div>
        </div>
        <div className="right-part">
          <CountryPanel sendSelectedCountries={updateSelectedCountries} />
        </div>
      </div>
      <div className="main-page-section">
        <div className="left-part"></div>
        <div className="right-part"></div>
      </div>
    </div>
  );
}

export default MainPage;
