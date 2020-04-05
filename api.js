var Global = require("./db/global.js");

module.exports = (app) => {

    app.get('/api/global_deaths', (req, res) => {
        Global.find({ location: req.query.location }, (err, results) => {
            if (err) throw err;
            res.status(200).json({
                success: true,
                data: results
            });
        })
    })

    // Return auto suggestions for countries
    app.get('/api/search_countries', (req, res) => {
        // TO REGEX
        Global.find({ location: { $regex: `.*${req.query.search}.*` } }).distinct('location').exec((err, result) => {
            if (err) {
                console.log("Error api search countries : %s", err);
                return res.json({
                    success: false,
                    error: err
                })
            }
            console.log(result)
            res.json({
                success: true,
                data: result
            })
        })
    })


}