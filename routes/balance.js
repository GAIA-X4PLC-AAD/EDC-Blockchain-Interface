import swaggerJsdoc from "swagger-jsdoc";
import { getBalance } from "../taquito/contract.js";

const getBalanceRoute = (client) => {
  /**
   * @swagger
   * /balance:
   *   get:
   *     summary: Retrieve the balance of admin account
   *     description: Return the balance in tez.
   *     responses:
   *       200:
   *         description: JSON of admin's balance in tez.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 balance:
   *                   type: double
   *                   description: Balance in tez.
   *                   example: 7759.4212
   *
   */

  client.get("/balance", async (req, res) => {
    let balance = await getBalance();
    res.status(200);
    res.send(JSON.stringify({ balance: balance }));
  });
};

export { getBalanceRoute };
