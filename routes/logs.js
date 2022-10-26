import { setTimeout } from "timers/promises";
import {
  getMapSize,
  postContractAgreement,
  postTransfer,
  transactionQuery,
  mintAsset,
  mintPolicy,
  getAllAssets,
  getAsset,
  getPolicy,
} from "../taquito/contract.js";

import { pinJSON } from "../pinata/ipfs.js";

export const getLogRoute = (client) => {
  /**
   * @swagger
   * /mint/asset:
   *   post:
   *     summary: Minting new asset token.
   *     description: Requests metadata object with reference to actual asset data to save metadata on ipfs and mint new token.
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
  client.post("/mint/asset", async (req, res) => {
    // Await upload of metadata
    console.log("Asset endpoint triggered");
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
    console.log("Set 15s timeout for pinning IPFS content...");
    await setTimeout(15000);
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
   *     description: Requests metadata object with reference to actual policy ressource to save metadata on ipfs and mint new token.
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
  client.post("/mint/policy", async (req, res) => {
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
    console.log("Set 15s timeout for pinning IPFS content...");
    await setTimeout(15000);
    // Initiate minting process
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
  client.get("/asset/:assetId", async (req, res) => {
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
  client.get("/policy/:policyId", async (req, res) => {
    try {
      let policyResult = await getPolicy(req.params.policyId);
      res.status(200);
      res.send(JSON.stringify(policyResult));
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });
};
