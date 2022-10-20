import { setTimeout } from "timers/promises";
import {
  getMapSize,
  postContractAgreement,
  postTransfer,
  transactionQuery,
  mintAsset,
  mintPolicy,
  getAllAssets,
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
   * /asset/all:
   *   get:
   *     summary: Get all minted assets.
   *     description: Returns json objects of tokenized assets.
   *     responses:
   *       200:
   *         description: Response in JSON.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 hashedLog:
   *                   type: string
   *                   description: Actual content of hashed Log.
   *                   example: TODO Provide example
   *                 consumer:
   *                   type: string
   *                   description: Consumer Id of this specific transaction.
   *                   example: BMW-649283
   *                 transactionId:
   *                   type: string
   *                   description: Requested transaction Id.
   *                   example: 75584
   *
   *
   */

  client.get("/asset/all", async (req, res) => {
    try {
      let dataMap = await getAllAssets();
      res.status(200);
      res.send(JSON.stringify(dataMap));
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });
};
