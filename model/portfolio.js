const mongoose = require('mongoose')
const portSchema = mongoose.Schema({
    nom : {
        type: String,
        required: true
    },
    prenom : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    adress : {
        type: String,
        required: true
    },
    telephone : {
        type: String,
        required: true
    },
    diplome : [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Diplome'
    }],
    experience : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Experience'
    },
})

module.exports = mongoose.model('Portfollio', portSchema)