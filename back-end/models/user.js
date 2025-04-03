const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    bookCollection: [{
        type: Object,
        bookId: {type: Number},
        bookTitle: { type: String },
        reading: { type: Boolean },
        required: true,
    }]
})

const collection = new mongoose.model("users", usersSchema);

module.exports = collection;