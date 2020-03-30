const express = require("express");
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
var colors = require('colors');
const csv = require('csvtojson');


// Set colors for console.log()
colors.setTheme({
    success: 'green',
    error: 'red',
    info: 'grey'
});

// json processing boilerplate
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Require the script to download the source data
require("./dataFetching.js");
var data = require('./dataFetching.js');

// APIs ===============================================================================================

// Get the list of available countries in the data source
app.get('/api/deaths', (req, res) => {
    csv()
        .fromFile('./data/time_series_covid19_deaths_global.csv')
        .then((jsonObj) => {
            return res.json(jsonObj.filter(el => el["Country/Region"] == req.query.country))
        })
})

// ====================================================================================================


// Serving the react app boilerplate
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

// Server boilerplate
var port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`----- listening on port ${port}`.success);
})