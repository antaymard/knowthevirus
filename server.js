const express = require("express");
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
var colors = require('colors');

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