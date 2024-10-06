const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    country_id: {type: String, required: true},
    latitude: {type: String, required: true},
    longitude: {type: String, required: true},
    brightness: {type: Number, required: true},
    brightness_c: {type: Number},
    scan: {type: String, required: true},
    track: {type: String, required: true},
    acq_date: {type: String, required: true},
    acq_time: {type: String, required: true},
    satellite: {type: String, required: true},
    instrument: {type: String, required: true},
    confidence: {type: String, required: true},
    version: {type: String, required: true},
    bright_t31: {type: String, required: true},
    frp: {type: String, required: true},
    daynight: {type: String, required: true},
    status:{type: Boolean, default: true}

});

schema.index({ latitude: 1, longitude: 1, acq_date: 1, acq_time: 1 }, { unique: true } )

const model = mongoose.model('ModisNRT', schema);

module.exports = model

