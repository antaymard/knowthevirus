const express = require("express");
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
var colors = require('colors');
const axios = require('axios');
var schedule = require('node-schedule');


// Set colors for console.log()
colors.setTheme({
    success: 'green',
    error: 'red',
    info: 'grey',
    important: 'yellow'
});

// json processing boilerplate
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Make the server auto ping to avoid heroku idle
function selfPing() {
    axios.get('https://knowthevirus.herokuapp.com/');
    console.log("self pinging !");
}
setInterval(selfPing, 1000 * 60 * 20);

// Require the script to download the source data
// require("./dataFetching-ourworldindata.js");

// Connect to the db
require('./db/setup.js')

// APIs ===============================================================================================

require('./api.js')(app);

// ====================================================================================================

// Worker for getting new datas
schedule.scheduleJob('* * /3 * * *', function (firedDate) {
    console.log('DL worker has been triggered at %s'.info, firedDate);
    require('./workers/refreshDatabase.js').run();
});



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