const express = require("express");
var app = express();
var bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

var port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`----- listening on port ${port}`);
})