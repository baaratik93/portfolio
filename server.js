const express = require('express')
const app = express()
const { buildSchema }  = require('graphql')
const { graphqlHTTP } = require('express-graphql')
mongoose.connect('mongodb://localhost/portfolio', { useNewUrlParser: true });

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
        shool: String!
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
            shool: String!
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

    },
    graphiql: true
}))
app.listen(3000, () => console.log('Bonjour'))