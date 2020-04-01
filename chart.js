const mongodb = require("mongodb").MongoClient;



let url = "mongodb://localhost:27017/";

mongodb.connect(url, function (err, client) {
    var db = client.db('ktv_db');

    db.collection('full_data', function (err, collection) {


        collection.find({ "location": "Spain" }).project({ "_id": 0, "new_cases": 0, "total_cases": 0, "total_deaths": 0, "location": 0 }).toArray(function (err, items) {
            if (err) throw err;
            return (items);
        });

        client.close();
    });


});

