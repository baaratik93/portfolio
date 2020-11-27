const mongoose = require('mongoose')

//Voici le modele Portfolio
module.exports.Portfolio = mongoose.model('Portfollio', mongoose.Schema({
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
    password : {
        type: String,
        required: true
    },
    diplome : [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Diplome'
    }],
    experience : [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Experience'
    }],
}))

// Le modèle diplôme


module.exports.Diplome = mongoose.model('Diplome', mongoose.Schema({
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
    },
    portfolio : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Portfolio'
    }

}))

//Le modèle Expérience



module.exports.Experience = mongoose.model('Experience', mongoose.Schema({
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
    },
    portfolio : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Portfolio'
    }
}))


//Le modèle Compétence


module.exports.Competence = mongoose.model('Competence', mongoose.Schema({
    domaine: {
        type: String,
        required: true
    },
    module: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }]
}))

// Le modèle Module



module.exports.Module = mongoose.model('Module', mongoose.Schema({
    title: {
        type: String,
        required: true
    }
}))