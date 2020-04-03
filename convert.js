// const csvtojson = require("csvtojson");
// require('./db/setup.js');
// var Global = require("./db/global.js");

// var data = [];

// csvtojson()
//     .fromFile("./data/full_data.csv")
//     .then(csvData => {
//         data = csvData;
//         addToDb(0);
//     });


// const addToDb = (n) => {

//     console.log("%s / %s", n, data.length);
//     console.log(data[n]);

//     let g = new Global({ ...data[n], short_date: data[n].date });
//     g.save((err, done) => {
//         if (err) thow(err);
//         console.log(done)
//         if (n + 1 <= data.length) {
//             addToDb(n + 1);
//         } else {
//             console.log("Conversion completed %s", n);
//             console.log("Please check if the following match");
//             console.log(data[data.length - 1]);
//             console.log(data[n - 1]);
//             console.log("============================")
//         }
//     });
// }