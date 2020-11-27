const express          = require('express')
const app              = express()
const mongoose         = require('mongoose')
const { buildSchema }  = require('graphql')
const { graphqlHTTP }  = require('express-graphql')
const { Diplome, Portfolio, Experience }             = require('./model/Model')
const bcrupt           = require('bcryptjs')
const jwt              = require('jsonwebtoken')
const bodyParser       = require('body-parser')
const auth             = require('./middlewares/authentication')
mongoose.connect('mongodb://localhost/portfolio', { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', error => {
	throw new Error('Le serveur de BD est injoignable')
})
db.once('open', () => {
	console.log('Serveur connecté avec succès')
})
app.use(express.json())
app.use(bodyParser.json())
app.use(express.json())
app.use(auth)
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
        password: String
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
    type authData  {
        token: String!
        tokenExp: Int!
    }

    type Competence {
        domaine: String!
        module: [Module!]
    }

    type Module {
        title: String!
    }



    input PortfolioInput {
        prenom: String!
        nom: String!
        email: String!
        adress: String!
        telephone: String!
        password: String
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

    input Credentials {
        email: String!
        password: String!
    }

    input CompetInput{
        domaine: String!
        module: [Module!]
    }


    type RootQuery {
        allDiplome: [Diplome!]
        allExperience: [Experience!]

    }

    type RootMutation {
        addDiplome(diplomeInput: DiplomeInput!): Diplome!
        addPortfolio(portfolioInput: PortfolioInput!): authData!
        addExperience(expInput: ExpInput!): Experience!
        addCompetence(competInput: CompetInput!): Competence
        addModule(module: String!): String!
        loginUser(credentials: Credentials!): authData!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
        addDiplome: async (args, req) => {
            if(!req.isAuth) {
                throw new Error("Veuillez vous connecter SVP!!!")
            }
            const diplome = await new Diplome({
                title: args.diplomeInput.title,
                school: args.diplomeInput.school,
                year: args.diplomeInput.year,
                portfolio: req.userId
            }).save()
            try {
                const foundPortf = await Portfolio.findById(req.userId)
                if(foundPortf) {
                    foundPortf.diplome.push(diplome)
                    foundPortf.save()
                }
                return {
                    ...diplome._doc,
                    _id: diplome.id
                }
            } catch (error) {
                throw error
            }
        },
        addPortfolio: async args => {
            try {
                const found = await
             Portfolio.findOne({
                email: args.portfolioInput.email
            })

            if(found) throw new Error('Ce portfolio existe')
            const portf = await new Portfolio({
                prenom: args.portfolioInput.prenom,
                nom: args.portfolioInput.nom,
                telephone: args.portfolioInput.telephone,
                email: args.portfolioInput.email,
                adress: args.portfolioInput.adress,
                password: bcrupt.hashSync(args.portfolioInput.password, 12),
                diplome: [],
                experience: []
            }).save()
            try {
                const token = jwt.sign(
                    {
                    email: portf.email,
                    userId: portf._id
                    },
                    "J'@imeB34uc0up",
                    {
                        expiresIn: '1h',
                    }
                )
                return {
                    token: token,
                    tokenExp: 1
                }
            } catch (error) {
                throw error
            }
            } catch (error) {
                throw error

            }
        },
        addExperience: async (args, req) => {
            if(!req.isAuth) {
                throw new Error("Veuillez vous connecter SVP!!!")
            }
            const exp = await new Experience({
                title: args.expInput.title,
                entreprise: args.expInput.entreprise,
                year: args.expInput.year,
                portfolio: req.userId
            }).save()
            try {
                const foundPortf = await Portfolio.findById(req.userId)
                if(foundPortf) {
                    foundPortf.experience.push(exp)
                    foundPortf.save()
                }
                return {
                    ...exp._doc,
                    _id: exp.id
                }
            } catch (error) {
                throw error
            }
        },
        loginUser: async (args) => {
            try {
                const userFound = await Portfolio.findOne({ email: args.credentials.email })
                if (!userFound) {
                    throw new Error("Ce portfolio n'existe pas")
                }
                
                if (!bcrupt.compareSync(args.credentials.password, userFound.password)) {
                    throw new Error("Mot de passe ne correspond pas")
                }
                const token = jwt.sign(
                    {
                    email: userFound.email,
                    userId: userFound._id
                    },
                    "J'@imeB34uc0up",
                    {
                        expiresIn: '1h',
                    }
                )
                return {
                    token: token,
                    tokenExp: 1
                }

            } catch (error) {
                throw error
            }
        }
    },
    graphiql: true
}))
app.listen(3000, () => console.log('Bonjour'))