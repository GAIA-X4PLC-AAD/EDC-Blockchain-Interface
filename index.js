import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { getBalanceRoute } from "./routes/balance.js";
import { getLogRoute } from "./routes/logs.js";

// set up express
const client = express();
client.use(express.json());
const port = 3000;

// Load speficig endspoints
getBalanceRoute(client);
getLogRoute(client);

// Swagger Setup
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Tezos Client utilizing Taquito",
    version: "1.0.0",
    description:
      "Interface to forward hashed logs from Eclipse Dataspace Connector to smart contract deployed on Tezos testnet.",
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
