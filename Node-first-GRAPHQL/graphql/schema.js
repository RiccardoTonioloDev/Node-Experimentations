//Si definiscono le varie query, mutazioni, subscriptions.
const { buildSchema } = require('graphql');

//Il ! sta a significare che è richiesta la stringa come valora di ritorno.
//type serve a definire un nuovo tipo, da poter utilizzare come variabile di ritorno.
//possiamo usare anche type per definire mutazioni e query quindi.
//input serve per definire un oggetto che vogliamo ricevere come input all'interno di una funzione.
module.exports = buildSchema(`
    type Post{
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }    

    type User{
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootQuery{
        login(email: String!, password: String!): AuthData!
        posts(page: Int): PostData!
        post(id: ID!): Post!
    }

    type RootMutation {
        createUser(userInput: UserInputData ): User!
        createPost(postInput: PostInputData): Post!
        updatePost(id: ID!,postInput: PostInputData): Post!
    } 

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
