import { setTimeout } from "timers/promises";
import {
  mintAsset,
  mintPolicy,
  getAllTokens,
  getAsset,
  getAssetByName,
  getPolicy,
  getPolicyByName,
  getContract,
  mintContract,
  writeTransfer,
} from "../taquito/contract.js";

import { pinJSON } from "../pinata/ipfs.js";
import fs from "fs";

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

export const getLogRoute = (client, isAuth, isPinning, isAdmin) => {
  /**
   * @swagger
   * /mint/asset:
   *   post:
   *     summary: Minting new asset token.
   *     description: Requests metadata object with reference to actual asset data to save metadata on ipfs and mint new token.
   *     parameters:
   *       - in: header
   *         name: username
   *         schema:
   *           type: string
   *         required: true
   *       - in: header
   *         name: apikey
   *         schema:
   *           type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               asset:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   properties:
   *                     type: object
   *                     properties:
   *                       asset:prop:name:
   *                         type: string
   *                       asset:prop:description:
   *                         type: string
   *                       asset:prop:contenttype:
   *                         type: string
   *                       asset:prop:version:
   *                         type: string
   *                       asset:prop:id:
   *                         type: string
   *               dataAddress:
   *                 type: object
   *                 properties:
   *                   properties:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: string
   *                       authKey:
   *                         type: string
   *                       filename:
   *                         type: string
   *                       authCode:
   *                         type: string
   *                       type:
   *                         type: string
   *     responses:
   *       201:
   *         description: Response might take a while since 2 confirmations are awaited.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: Status of log forwarding.
   *                   example: ok
   *                 hash:
   *                   type: string
   *                   description: Hash of blockchain transaction.
   *                   example: https://ithacanet.smartpy.io/ooSLJmoD4My5UmS7fsVLbqJ5aj3hyBqQyBPSNHrswhwH4MkNtQW
   *
   */
  client.post("/mint/asset", isAuth, isPinning, async (req, res) => {
    // Await upload of metadata
    console.log("Asset endpoint triggered");
    let request = req.body;
    let ipfsHash;
    let blockHash;
    let metaUri;

    // Initiate ipfs pinning
    try {
      console.log("IPFS Pinning...");
      ipfsHash = await pinJSON(request);
      metaUri = "ipfs://" + ipfsHash;
      //res.status(201).send(metaUri);
    } catch (error) {
      res.status(404);
      res.send(error.message);
      return;
    }
    // Initiate minting process
    try {
      console.log("Minting process...");
      blockHash = await mintAsset(metaUri);
      let returnObject = {
        status: "ok",
        hash: blockHash,
      };
      res.status(201);
      res.send(JSON.stringify(returnObject));
    } catch (error) {
      res.status(400);
      res.send(error.message);
    }
  });

  /**
   * @swagger
   * /mint/policy:
   *   post:
   *     summary: Minting new policy token.
   *     description: Requests metadata object with reference to actual policy resource to save metadata on ipfs and mint new token.
   *     parameters:
   *       - in: header
   *         name: username
   *         schema:
   *           type: string
   *         required: true
   *       - in: header
   *         name: apikey
   *         schema:
   *           type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       201:
   *         description: Response might take a while since 2 confirmations are awaited.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: Status of log forwarding.
   *                   example: ok
   *                 hash:
   *                   type: string
   *                   description: Hash of blockchain transaction.
   *                   example: https://ithacanet.smartpy.io/ooSLJmoD4My5UmS7fsVLbqJ5aj3hyBqQyBPSNHrswhwH4MkNtQW
   *
   */
  client.post("/mint/policy", isAuth, isPinning, async (req, res) => {
    // Await upload of metadata
    console.log("Policy endpoint triggered");
    let request = req.body;
    let ipfsHash;
    let blockHash;

    // Initiate ipfs pinning
    try {
      console.log("IPFS Pinning...");
      ipfsHash = await pinJSON(request);
    } catch (error) {
      res.status(404);
      res.send(error.message);
      return;
    }
    let metaUri = "ipfs://" + ipfsHash;
    try {
      console.log("Minting process...");
      blockHash = await mintPolicy(metaUri);
      let returnObject = {
        status: "ok",
        hash: blockHash,
      };
      res.status(201);
      res.send(JSON.stringify(returnObject));
    } catch (error) {
      res.status(400);
      res.send(error.message);
    }
  });

  /**
   * @swagger
   * /mint/contract:
   *   post:
   *     summary: Minting new contract token.
   *     description: Requests metadata object with reference to actual contract resource to save metadata on ipfs and mint new token.
   *     parameters:
   *       - in: header
   *         name: username
   *         schema:
   *           type: string
   *         required: true
   *       - in: header
   *         name: apikey
   *         schema:
   *           type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                createdAt:
   *                  type: integer
   *                  format: int32
   *                  example: 1671097867
   *                dataUrl:
   *                  type: string
   *                  example: testUrl
   *                id:
   *                  type: string
   *                  example: 5
   *                accessPolicyId:
   *                  type: string
   *                  example: cdc508ea-de26-4194-9179-7102058da136
   *                contractPolicyId:
   *                  type: string
   *                  example: cdc508ea-de26-4194-9179-7102058da136
   *                criteria:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      operandLeft:
   *                        type: string
   *                        example: asset:prop:id
   *                      operator:
   *                        type: string
   *                        example: =
   *                      operandRight:
   *                        type: string
   *                        example: test-document-47
   *     responses:
   *       201:
   *         description: Response might take a while since 2 confirmations are awaited.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: Status of log forwarding.
   *                   example: ok
   *                 hash:
   *                   type: string
   *                   description: Hash of blockchain transaction.
   *                   example: https://ithacanet.smartpy.io/ooSLJmoD4My5UmS7fsVLbqJ5aj3hyBqQyBPSNHrswhwH4MkNtQW
   *
   */

  client.post("/mint/contract", isAuth, isPinning, async (req, res) => {
    // Await upload of metadata
    console.log("Contract endpoint triggered");
    let request = req.body;
    let ipfsHash;
    let blockHash;

    // Initiate ipfs pinning
    try {
      console.log("IPFS Pinning...");
      ipfsHash = await pinJSON(request);
    } catch (error) {
      res.status(404);
      res.send(error.message);
      return;
    }
    let metaUri = "ipfs://" + ipfsHash;
    try {
      console.log("Minting process...");
      blockHash = await mintContract(metaUri);
      let returnObject = {
        status: "ok",
        hash: blockHash,
      };
      res.status(201);
      res.send(JSON.stringify(returnObject));
    } catch (error) {
      res.status(400);
      res.send(error.message);
    }
  });

  /**
   * @swagger
   * /asset/{assetId}:
   *   get:
   *     summary: Retrieve token metadata of asset for given id.
   *     description: Retrieve token metadata of asset for given id.
   *     parameters:
   *       - in: path
   *         name: assetId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Token Id
   *     responses:
   *       200:
   *         description: Response in JSON.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 admin:
   *                   type: string
   *                   description: Tz address of smart contract's admin.
   *                   example: tz1RTt21hfc9rndKcQTS1CeF5rzr8bJ5nhV5
   *                 mapSize:
   *                   type: int
   *                   description: Amount of stored logs.
   *                   example: 5
   *
   */
  client.get("/asset/:assetId", isAuth, async (req, res) => {
    try {
      let assetResult = await getAsset(req.params.assetId);
      res.status(200);
      res.send(JSON.stringify(assetResult));
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });

  /**
   * @swagger
   * /assetName/{assetName}:
   *   get:
   *     summary: Retrieve token metadata of asset for given document name.
   *     description: Make sure you know the exact document name.
   *     parameters:
   *       - in: path
   *         name: assetName
   *         schema:
   *           type: string
   *           example: test-document-34
   *         required: true
   *         description: Exact name of asset
   *     responses:
   *       200:
   *         description: Asset in JSON format.
   *
   *
   */
  client.get("/assetName/:assetName", isAuth, async (req, res) => {
    try {
      let assetResult = await getAssetByName(req.params.assetName);
      res.status(200);
      res.send(JSON.stringify(assetResult));
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });

  /**
   * @swagger
   * /policy/{policyId}:
   *   get:
   *     summary: Retrieve token metadata of policy for given id.
   *     description: Retrieve token metadata of policy for given id.
   *     parameters:
   *       - in: path
   *         name: policyId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Token Id
   *     responses:
   *       200:
   *         description: Response in JSON.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 admin:
   *                   type: string
   *                   description: Tz address of smart contract's admin.
   *                   example: tz1RTt21hfc9rndKcQTS1CeF5rzr8bJ5nhV5
   *                 mapSize:
   *                   type: int
   *                   description: Amount of stored logs.
   *                   example: 5
   *
   */
  client.get("/policy/:policyId", isAuth, async (req, res) => {
    try {
      let policyResult = await getPolicy(req.params.policyId);
      res.status(200);
      res.send(JSON.stringify(policyResult));
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });

  /**
   * @swagger
   * /policyName/{policyName}:
   *   get:
   *     summary: Retrieve token metadata of policy for given document name.
   *     description: Make sure you know the exact document name.
   *     parameters:
   *       - in: path
   *         name: policyName
   *         schema:
   *           type: string
   *           example: 78c7919b-7774-401a-8ad3-b79760ba4d65
   *         required: true
   *         description: Exact name of policy
   *     responses:
   *       200:
   *         description: Asset in JSON format.
   *
   *
   */
  client.get("/policyName/:policyName", isAuth, async (req, res) => {
    try {
      let policyResult = await getPolicyByName(req.params.policyName);
      res.status(200);
      res.send(JSON.stringify(policyResult));
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });

  /**
   * @swagger
   * /contract/{contractId}:
   *   get:
   *     summary: Retrieve token metadata of contract for given id.
   *     description: Retrieve token metadata of contract for given id.
   *     parameters:
   *       - in: path
   *         name: contractId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Token Id
   *     responses:
   *       200:
   *         description: Response in JSON.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 admin:
   *                   type: string
   *                   description: Tz address of smart contract's admin.
   *                   example: tz1RTt21hfc9rndKcQTS1CeF5rzr8bJ5nhV5
   *                 mapSize:
   *                   type: int
   *                   description: Amount of stored logs.
   *                   example: 5
   *
   */
  client.get("/contract/:contractId", isAuth, async (req, res) => {
    try {
      let contractResult = await getContract(req.params.contractId);
      res.status(200);
      res.send(JSON.stringify(contractResult));
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });

  /**
   * @swagger
   * /all/{tokenType}:
   *   get:
   *     summary: Retrieve all token metadata of contract for given token type.
   *     description: Retrieve token metadata of contract for given token type.
   *     parameters:
   *       - in: path
   *         name: tokenType
   *         schema:
   *           type: string
   *           enum:
   *             - asset
   *             - policy
   *             - contract
   *           default: asset
   *         required: true
   *         description: Token Type
   *     responses:
   *       200:
   *         description: Response in JSON.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 admin:
   *                   type: string
   *                   description: Tz address of smart contract's admin.
   *                   example: tz1RTt21hfc9rndKcQTS1CeF5rzr8bJ5nhV5
   *                 mapSize:
   *                   type: int
   *                   description: Amount of stored logs.
   *                   example: 5
   *
   */
  client.get("/all/:tokenType", isAuth, async (req, res) => {
    let tokenType = req.params.tokenType;
    try {
      let assetResult = await getAllTokens(tokenType);
      res.status(200);
      res.send(JSON.stringify(assetResult));
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });
  /**
   * @swagger
   * /transfer/add:
   *   post:
   *     summary: Write data transfer to smart contract.
   *     description: Manually add metadata of data transfer to smart contract.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       201:
   *         description: Response might take a while since 2 confirmations are awaited.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: Status of log forwarding.
   *                   example: ok
   *                 operationRef:
   *                   type: string
   *                   description: Hash of blockchain transaction.
   *                   example: https://better-call.dev/ghostnet/opg/oouUPSmsoCXrSudfNkPk9YGpsi5afXoDMqYcDsT5n8fohXyMFCo/contents
   *
   */

  client.post("/transfer/add", async (req, res) => {
    // Await upload of metadata
    //let request = req.body;
    let request = req.body;
    try {
      let operationUrl = await writeTransfer(request);
      res.status(201);
      res.send(JSON.stringify({ status: "ok", operationRef: operationUrl }));
    } catch (error) {
      res.status(400);
      res.send(error.message);
    }
  });

  /**
   * @swagger
   * /auth/user/add:
   *   post:
   *     summary: Add user to json whitelist enabling them to pin data to local IPFS node.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                name:
   *                  type: string
   *                  example: john
   *                description:
   *                  type: string
   *                  example: Describe the user account
   *                key:
   *                  type: string
   *                  example: password
   *                pinLimit:
   *                  type: integer
   *                  example: 100
   *     responses:
   *       201:
   *         description: Await response for updated role list.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *
   *
   */
  client.post("/auth/user/add", isAuth, isAdmin, async (req, res) => {
    let request = req.body;
    let newUser = {
      name: request.name,
      description: request.description,
      createdAt: new Date().toISOString(),
      key: request.key,
      permissions: { toPin: request.pinLimit },
      stats: { pinnedFiles: 0 },
    };
    profiles[request.name] = newUser;
    fs.writeFileSync("./auth/profiles.json", JSON.stringify(profiles));
    res.status(201);
    res.send(JSON.stringify(profiles));
  });
};
