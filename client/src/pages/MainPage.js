import React, { useEffect, useState } from "react";
import queryString from "query-string";
import axios from "axios";

import CountryPanel from "../components/countryPanel/CountryPanel";
import "./mainPage.css";
import {
  AreaChart,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function MainPage() {
  //window.addEventListener('resize', reportWindowSize);

  const [data, setData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  var i = 0;
  var selCountries = selectedCountries.map((item) => item.country);
  useEffect(() => {
    axios.post("/api/global_deaths", selCountries).then((res) => {
      const newArr = res.data.data.map((item) => {
        return {
          short_date: item.short_date,
          total_deaths: item.total_deaths,
          location: item.location,
          date_relative: i,
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
            <ResponsiveContainer width="90%" height="96%">
              <LineChart
                width={800}
                height={600}
                data={data}
                margin={{ top: 5, right: 5, bottom: 5, left: 20 }}
              >
                <XAxis
                  label={{
                    value: "Relative date",
                    position: "insideBottom",
                    offset: -5,
                  }}
                  dataKey="date_relative"
                  allowDuplicatedCategory={false}
                  stroke="white"
                />
                <YAxis
                  label={{
                    value: "Total deaths",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                  }}
                  stroke="white"
                />
                <Legend verticalAlign="top" height={36} />
                <CartesianGrid stroke="#f5f5f5" />
                {selectedCountries.map((item) => {
                  i = 0;
                  const color = item.color;
                  console.log(selectedCountries);
                  console.log(color);
                  var json = data.filter(function (a) {
                    if (a.total_deaths > 10) {
                      return a.location == item.country;
                    }
                  });
                  json.map((item) => {
                    item.date_relative = i;
                    i++;
                  });
                  console.log(json);
                  return (
                    <Line
                      type="monotone"
                      dataKey="total_deaths"
                      stroke={color}
                      data={json}
                      name={item.country}
                    />
                  );
                })}
                <CartesianGrid stroke="#ccc" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
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
