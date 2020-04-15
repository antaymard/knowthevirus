const csvtojson = require("csvtojson");
require('../db/setup.js');
var Global = require("../db/global.js");

console.log('Convert util has been launched')

var data = [];

csvtojson()
    .fromFile("./data/full_data.csv")
    .then(csvData => {
        data = csvData;


        // Find last date present in the db
        Global.find({ location: 'France' }).sort(' -short_date ').limit(10).exec((err, entries) => {
            if (err) throw err;
            console.log(entries[0])

            data = data.filter((e) => e.date > entries[0].short_date);
            console.log(data.length);
            console.log(data.filter((e) => e.location === 'France'))
            if (data.length > 0) {
                addToDb(0);
            } else {
                console.log("Database already up to date".info)
            }
        })

    });


const addToDb = (n) => {

    console.log("%s / %s", n, data.length);
    console.log(data[n]);

    let g = new Global({ ...data[n], short_date: data[n].date });
    g.save((err, done) => {
        if (err) thow(err);
        console.log(done)
        if (n + 1 < data.length) {
            addToDb(n + 1);
        } else {
            console.log("Conversion completed %s", n);
            console.log("Please check if the following match");
            console.log(data[data.length - 1]);
            console.log(data[n - 1]);
            console.log("============================")
        }
    });
}