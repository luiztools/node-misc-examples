import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";

import express from "express";
const app = express();

app.use(express.json());

app.use("/graphql", graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
}));

app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));
