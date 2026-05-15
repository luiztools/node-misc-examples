import { buildSchema } from "graphql";

export default buildSchema(`
    input UserInputData {
        name: String!
        email: String!
        password: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        logs: [String!]
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }
    
    type TestData {
        text: String!
        views: Int!
    }

    type RootQuery {
        hello: TestData!
    }

    schema {
        query: RootQuery,
        mutation: RootMutation
    }
`);