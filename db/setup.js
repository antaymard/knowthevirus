var mongoose = require('mongoose');

if (process.env.heroku === "yes") {
    console.log("Getting the config from heroku variables");
    var config = process.env;
    console.log(config);
} else {
    console.log("Getting the config from local file variables");
    var config = require('../config.js');
}

// MongoDB boilerplate
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.connection.on("error", function (err) {
    console.error('== Erreur connexion à la DB : %s'.error, err);
});
mongoose.connection.on('open', function () {
    console.log('== Connexion réussie à la DB'.success);
});