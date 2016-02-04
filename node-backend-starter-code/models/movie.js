var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema   = new Schema({
    imdbID: String,
    title: String, //matching what we get from the API
    uuid: String
});

module.exports = mongoose.model('Movie', MovieSchema);