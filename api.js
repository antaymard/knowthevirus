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

}