const mongoose = require('mongoose')
const expSchema = mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    entreprise : {
        type: String,
        required: true
    },
    year : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Experience', expSchema)