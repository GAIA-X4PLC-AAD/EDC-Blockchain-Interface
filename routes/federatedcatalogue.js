import swaggerJsdoc from "swagger-jsdoc";
import { getVerifiablePresentation } from "../federatedcatalogue/verifiable_presentation.js";

const getVerifiablePresentationRoute = (client) => {
/**
   * @swagger
   * /verifiablepresentation:
   *   post:
   *     summary: Create a Verifiable Presentation (VP) of a EDC Asset.
   *     description: Requests metadata object with reference to actual asset data to save metadata on ipfs and mint new token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               surveyId:
   *                 type: string
   *               surveyDescription:
   *                 tyoe: string
   *               surveyTitle:
   *                 type: string
   *               surveyUrl:
   *                 type: string
   *     responses:
   *       200:
   *         description: Response might take a while since waiting for an external APIs response.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               verifiable-presentation:
   *
   */


client.post("/verifiablepresentation", async (req, res) => {
    // Await upload of metadata
    console.log("verifiablepresentation endpoint triggered");
    let request = req.body;
    console.log(request);

    let verifiablePresentation = await getVerifiablePresentation(request);

    res.status(200);
    res.send(verifiablePresentation);
  });
}

export { getVerifiablePresentationRoute };
