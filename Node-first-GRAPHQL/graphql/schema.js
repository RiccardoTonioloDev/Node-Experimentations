//Si definiscono le varie query, mutazioni, subscriptions.
const { buildSchema } = require('graphql');

//Il ! sta a significare che è richiesta la stringa come valora di ritorno
module.exports = buildSchema(`
    
    type TestData {
        text: String!
        views: Int!
    }

    type RootQuery {
        hello: TestData!
    }

    schema {
        query: RootQuery
    }
`);
