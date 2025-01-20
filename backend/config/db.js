const mongoose = require("mongoose")
const connectDB = async () => {
    return mongoose.connect("mongodb+srv://botnishant:botnishant@contact.vywuu.mongodb.net/")
    .then(() => console.log(`connection to the database established...`))
    .catch((err)=> console.log(err))
};

module.exports = connectDB;