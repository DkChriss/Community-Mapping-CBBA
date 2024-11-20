const mongose = require('mongoose')

const schema = new mongose.Schema({

    name: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true}
});

const model = mongose.model("User", schema);

module.exports = model