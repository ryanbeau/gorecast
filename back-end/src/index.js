// External Modules

var { graphqlHTTP } = require("express-graphql");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { clientOrigins, serverPort } = require("./config/env.dev");
const resolvers = require("./data/resolvers");
const schema = require("./data/schema");

const { messagesRouter } = require("./messages/messages.router");

// App Variables

const app = express();
const apiRouter = express.Router();

// App Configuration

app.use(helmet());
app.use(cors({ origin: clientOrigins }));
app.use(express.json());

app.use("/api", apiRouter);
app.use(
  "/api/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

apiRouter.use("/messages", messagesRouter);

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send(err.message);
});

//Server Activation

app.listen(serverPort, () =>
  console.log(`API Server listening on port ${serverPort}`)
);
