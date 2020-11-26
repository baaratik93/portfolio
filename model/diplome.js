const mongoose = require('mongoose')
const diplomeSchema = mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    school : {
        type: String,
        required: true
    },
    year : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Diplome', diplomeSchema)