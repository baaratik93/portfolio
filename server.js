const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { buildSchema }  = require('graphql')
const { graphqlHTTP } = require('express-graphql')
const Diplome = require('./model/diplome')
const Experience = require('./model/experience')
mongoose.connect('mongodb://localhost/portfolio', { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', error => {
	throw new Error('Le serveur de BD est injoignable')
})
db.once('open', () => {
	console.log('Serveur connecté avec succès')
})
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`

    type Portfolio {
        prenom: String!
        nom: String!
        email: String!
        adress: String!
        telephone: String!
        diplome: [Diplome]
        experience: [Experience]
    }

    type Diplome {
        title: String!
        school: String!
        year: String!
    }

    type Experience {
        title: String!
        entreprise: String!
        year: String!

    }
    input PortfolioInput {
        prenom: String!
        nom: String!
        email: String!
        adress: String!
        telephone: String!
    }
    input DiplomeInput {
            title: String!
            school: String!
            year: String!
    }
    input ExpInput {
        title: String!
        entreprise: String!
        year: String!
    }

    type RootQuery {
        allDiplome: [Diplome!]
        allExperience: [Experience!]

    }

    type RootMutation {
        addDiplome(diplomeInput: DiplomeInput!): Diplome!
        addPortfolio(potfolioInput: PortfolioInput!): Portfolio!
        addExperience(expInput: ExpInput!): Experience!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
        addDiplome: async args => {
            const diplome =await new Diplome({
                title: args.diplomeInput.title,
                school: args.diplomeInput.school,
                year: args.diplomeInput.year
            }).save()
            try {
                return {
                    ...diplome._doc,
                    _id: diplome.id
                }
            } catch (error) {
                throw error
            }
        },
        addExperience: async args => {
            const exp = await new Experience({
                title: args.expInput.title,
                entreprise: args.expInput.entreprise,
                year: args.expInput.year
            }).save()
            try {
                return {
                    ...exp._doc,
                    _id: exp.id
                }
            } catch (error) {
                throw error
            }
        }
    },
    graphiql: true
}))
app.listen(3000, () => console.log('Bonjour'))