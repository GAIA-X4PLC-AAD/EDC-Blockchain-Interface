import express from "express";
import https from "https";
import fs from "fs";
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

// Auth middleware
const isAuth = (req, res, next) => {
  const auth = req.headers.apikey;
  if (auth === "123456") {
    next();
  } else {
    res.status(401);
    res.send("Access forbidden " + req.headers.apiKey);
  }
};

// Load endpoints
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

https
  .createServer(
    {
      key: fs.readFileSync("./ssl/key.pem"),
      cert: fs.readFileSync("./ssl/cert.pem"),
    },
    client
  )
  .listen(port, () => {
    console.log(`API listening at https://localhost:${port}`);
    console.log(`For API Documentation see https://localhost:${port}/docs`);
  });
