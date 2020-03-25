const express = require("express");
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
var colors = require('colors');
const GitFileDownloader = require('git-file-downloader');

colors.setTheme({
    success: 'green',
    error: 'red'
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Dowload the csv file from Github
const downloader = new GitFileDownloader({
    provider: 'github',
    repository: 'CSSEGISandData/COVID-19',
    branch: 'master',
    file: 'csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv',
    output: './data'
});

downloader.run(() => {
    console.log("File downloaded from Github".success)
}).catch(err => {
    console.log('Error downloading data from Github'.error)
    console.error(err);
    // process.exitCode = 1;
});



app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

var port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`----- listening on port ${port}`.success);
})