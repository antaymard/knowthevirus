const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GlobalSchema = new Schema({
    createdOn: { type: Date, default: new Date() },
    location: { type: String },
    date: { type: Date, default: null },
    short_date: { type: String, default: null },
    new_cases: { type: Number, default: 0 },
    new_deaths: { type: Number, default: 0 },
    total_cases: { type: Number, default: 0 },
    total_deaths: { type: Number, default: 0 },
});

var Global = mongoose.model('Global', GlobalSchema);
module.exports = Global;