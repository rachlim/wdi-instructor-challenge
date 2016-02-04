var mongoose = require("mongoose");

mongoose.connect(process.env.PROD_MONGODB);

module.exports = mongoose.connection;