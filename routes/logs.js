import { MissedBlockDuringConfirmationError } from "@taquito/taquito";
import {
  getMapSize,
  postContractAgreement,
  postTransfer,
  transactionQuery,
  mintAsset,
} from "../taquito/contract.js";

import { pinJSON } from "../pinata/ipfs.js";

export const getLogRoute = (client) => {
  /**
   * @swagger
   * /{logMap}/size:
   *   get:
   *     summary: Retrieve the size of the log map.
   *     description: Returns the amount of stored logs and the smart contract's admin.
   *     parameters:
   *       - in: path
   *         name: logMap
   *         schema:
   *           type: string
   *           enum: [contractAgreementMap, dataTransferMap]
   *         required: true
   *         description: Name of the Map
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
  client.get("/:logMap/size", async (req, res) => {
    const mapName = req.params.logMap;
    try {
      let mapSize = await getMapSize(mapName);
      res.status(200);
      res.send(JSON.stringify(mapSize));
    } catch (error) {
      res.status(400);
      res.send(JSON.stringify({ error: error.message }));
    }
  });

  /**
   * @swagger
   * /contractAgreementMap/add:
   *   post:
   *     summary: Add new logs to the contract map inside the smart contract.
   *     description: Endpoint to forward transaction logs from EDC to blockchain.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               consumerId:
   *                 type: string
   *                 description: Unique identifier of consumer regarding this transaction.
   *                 example: BMW-649283
   *               producerId:
   *                 type: string
   *                 description: Unique identifier of producer regarding this transaction.
   *                 example: TUB-649283
   *               transactionId:
   *                 type: string
   *                 description: Unique transaction identifier.
   *                 example: 75584
   *               timestamp:
   *                 type: string
   *                 description: Unix timestamp in seconds provided as a string.
   *                 example: 1655198457
   *               hashedContract:
   *                 type: string
   *                 description: Hashed log content of EDC transaction.
   *                 example: Placeholder for hashed log
   *               assetToken:
   *                 type: string
   *                 description: Representation of corresponding asset, which is included in this contract.
   *                 example: Token placeholder
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
  client.post("/contractAgreementMap/add", async (req, res) => {
    let request = req.body;
    if (
      request.producerId != null &&
      request.consumerId != null &&
      request.transactionId != null &&
      request.timestamp != null &&
      request.assetToken != null &&
      request.hashedContract != null
    ) {
      // trigger smart contract endpoint
      try {
        let response = await postContractAgreement(
          request.producerId,
          request.consumerId,
          request.transactionId,
          request.timestamp,
          request.assetToken,
          request.hashedContract
        );
        res.status(201);
        res.send(JSON.stringify(response));
      } catch (error) {
        res.status(400);
        res.send(error.message);
      }
    } else {
      res.status(400);
      res.send("Body parameters are invalid");
    }
  });

  /**
   * @swagger
   * /dataTransferMap/add:
   *   post:
   *     summary: Add new logs to the data transfer map inside the smart contract.
   *     description: Important endpoint to forward transaction logs from EDC to blockchain.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               consumerId:
   *                 type: string
   *                 description: Unique identifier of consumer regarding this transaction.
   *                 example: BMW-649283
   *               producerId:
   *                 type: string
   *                 description: Unique identifier of producer regarding this transaction.
   *                 example: TUB-649283
   *               transactionId:
   *                 type: string
   *                 description: Unique transaction identifier.
   *                 example: 75584
   *               timestamp:
   *                 type: string
   *                 description: Unix timestamp in seconds provided as a string.
   *                 example: 1655198457
   *               assetToken:
   *                 type: string
   *                 description: Representation of corresponding asset, which is included in this contract.
   *                 example: Token placeholder
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
  client.post("/dataTransferMap/add", async (req, res) => {
    let request = req.body;
    if (
      request.producerId != null &&
      request.consumerId != null &&
      request.transactionId != null &&
      request.timestamp != null &&
      request.assetToken != null
    ) {
      // trigger smart contract endpoint
      try {
        let response = await postTransfer(
          request.producerId,
          request.consumerId,
          request.transactionId,
          request.timestamp,
          request.assetToken
        );
        res.status(201);
        res.send(JSON.stringify(response));
      } catch (error) {
        res.status(400);
        res.send(error.message);
      }
    } else {
      res.status(400);
      res.send("Body parameters are invalid");
    }
  });

  /**
   * @swagger
   * /data/{logMap}:
   *   get:
   *     summary: Get data object of unique transaction id.
   *     description: Returns hashed Log, consumer and transaction Id in JSON.
   *     parameters:
   *       - in: path
   *         name: logMap
   *         schema:
   *           type: string
   *           enum: [contractAgreementMap, dataTransferMap]
   *         required: true
   *         description: Name of the Map
   *       - in: query
   *         name: transactionId
   *         required: true
   *         description: Unique transaction Id for requested Log data.
   *         schema:
   *           type: string
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
  client.get("/data/:logMap", async (req, res) => {
    if (req.query.transactionId == null) {
      res.status(400);
      res.send("Bad query parameters");
    }
    try {
      let dataMap = await transactionQuery(
        req.query.transactionId,
        req.params.logMap
      );
      res.status(200);
      res.send(JSON.stringify(dataMap));
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });

  client.post("/mint/asset", async (req, res) => {
    // Await upload of metadata
    let request = req.body;
    let ipfsHash = await pinJSON(request);
    let metaUri = "ipfs://" + ipfsHash;
    await mintAsset(metaUri);
  });
};
