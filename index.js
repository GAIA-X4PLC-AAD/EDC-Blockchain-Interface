import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { getBalanceRoute } from "./routes/balance.js";
import { getLogRoute } from "./routes/logs.js";
import dotenv from "dotenv";

// set up express
const client = express();
client.use(express.json());
const port = 3000;

dotenv.config();

// auth middleware
const isAuth = (req, res, next) => {
  const auth = req.headers.apiKey;
  if (auth === "password") {
    next();
  } else {
    res.status(401);
    res.send("Access forbidden");
  }
};

// Load speficig endspoints
getBalanceRoute(client);
getLogRoute(client, isAuth);

// Swagger Setup
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Tezos Client for Contract Management",
    version: "1.0.0",
    description:
      "Interface to forward Assets, Policies and Contracts from Eclipse Dataspace Connector to smart contract deployed on Tezos testnet.",
  },
  servers: [
    { url: "http://" + "localhost" + ":3000", description: "Dev Server" },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
client.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

client.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
  console.log(`For API Documentation see http://localhost:${port}/docs`);
});
