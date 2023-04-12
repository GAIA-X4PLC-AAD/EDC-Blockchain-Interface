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

//import profile json
let profiles = JSON.parse(fs.readFileSync("./auth/profiles.json", "utf8"));
fs.watch("./auth/profiles.json", (eventType, filename) => {
  if (filename) {
    console.log(`File ${filename} changed`);
    fs.readFile("./auth/profiles.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let json = JSON.parse(data);
      profiles = json;
    });
  }
});

// Auth middleware
const isAuth = (req, res, next) => {
  const key = req.headers.apikey;
  const userName = req.headers.username;
  if (profiles[userName] === undefined) {
    res.status(401);
    res.send("User not found");
  } else {
    if (key === profiles[userName].key) {
      next();
    } else {
      res.status(401);
      res.send("Access forbidden for user: " + req.headers.username);
    }
  }
};

// Pinning middleware
const isPinning = (req, res, next) => {
  if (
    profiles[req.headers.username].stats.pinnedFiles <
    profiles[req.headers.username].permissions.toPin
  ) {
    profiles[req.headers.username].stats.pinnedFiles++;
    fs.writeFileSync("./auth/profiles.json", JSON.stringify(profiles));
    next();
  } else {
    res.status(403);
    res.send("You have reached your pinning limit");
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  const key = req.headers.apikey;
  const userName = req.headers.username;
  if (userName == "admin" && key === profiles[userName].key) {
    next();
  } else {
    res.status(401);
    res.send("Access forbidden for user: " + req.headers.username);
  }
};

// Load endpoints
getBalanceRoute(client);
getLogRoute(client, isAuth, isPinning, isAdmin);

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
