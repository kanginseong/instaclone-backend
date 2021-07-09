// require("dotenv").config();
// import { ApolloServer } from "apollo-server";
// import { typeDefs, resolvers } from "./schema";
// import { getUser } from "./users/users.utils";

// const PORT = process.env.PORT;
// const server = new ApolloServer({
//   resolvers,
//   typeDefs,
//   context: async ({ req }) => {
//     return {
//       loggedInUser: await getUser(req.headers.token),
//     };
//   },
// });

// server
//   .listen(PORT)
//   .then(() =>
//     console.log(`🍖 Server is running on http://localhost:${PORT} ✔`)
//   );

require("dotenv").config();
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

const app = express();
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
apollo.applyMiddleware({ app });
app.listen({ port: PORT }, () => {
  console.log(`🍖 Server is running on http://localhost:${PORT} ✔`);
});
