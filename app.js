const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

/* swagger Info */
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "ITIS-6177-Final-Project",
      version: "1.0.0",
      description: "Final project using Text Analytics from Azure",
      contact: {
        name: "Dileep Kumar Komatineni",
        url: "https://github.com/Dileepkomatineni",
        email: "dkomatin@uncc.edu",
      },
    },
    host: "localhost:3000",
    basePath: "/",
  },
  apis: ["./app.js"],
};

const specs = swaggerJsDoc(options);
/*Swagger End*/

require("dotenv").config();
const {
  TextAnalyticsClient,
  AzureKeyCredential,
} = require("@azure/ai-text-analytics");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const API_KEY = process.env.API_KEY;
const END_POINT = "https://entityrecognition-si.cognitiveservices.azure.com/";

const textAnalyticsClient = new TextAnalyticsClient(
  END_POINT,
  new AzureKeyCredential(API_KEY)
);

/**
 * @swagger
 * /EntityRecognition:
 *   post:
 *     tags:
 *       - Named Entity Recognition
 *     description: Calls the NER API from Azure Text Analytics to identity entities found in text.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Input to NER API.
 *         in: body
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *              type: string
 *           example: {"inputText":["Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800","La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."]}
 *     responses:
 *       200:
 *         description: Successfully retrieved response
 */

app.post("/EntityRecognition", async (req, res) => {
  let entityInputs = req.body.inputText;
  console.log(entityInputs);
  let resArr = [];

  for (let items of chunkInputArray(entityInputs, 5)) {
    let entityResults = await textAnalyticsClient.recognizeEntities(items);
    resArr.push(entityResults);
  }

  console.log(resArr);
  return res.json(resArr);
});

function chunkInputArray(inputs, chunkSize) {
  var chunkedArray = [];
  for (var i = 0; i < inputs.length; i += chunkSize) {
    chunkedArray.push(inputs.slice(i, i + chunkSize));
  }
  return chunkedArray;
}

/**
 * @swagger
 * /EntityLinking:
 *   post:
 *     tags:
 *       - NER Entity Linking
 *     description: Calls NER API from Azure Text Analytics to identify and disambiguates the identity of entities found in text.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Input to NER API.
 *         in: body
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *              type: string
 *           example: {"SampleText":["Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800. During his career at Microsoft, Gates held the positions of chairman, chief executive officer, president and chief software architect, while also being the largest individual shareholder until May 2014."]}
 *     responses:
 *       200:
 *         description: Successfully retrieved response
 */

app.post("/EntityLinking", async (req, res) => {
  let linkedEntityInput = req.body.SampleText;
  console.log(linkedEntityInput);
  const entityResults = await textAnalyticsClient.recognizeLinkedEntities(
    linkedEntityInput
  );

  res.json(entityResults);
});

/**
 * @swagger
 * /pii:
 *   post:
 *     tags:
 *       - NER Personally Identifiable Information
 *     description: Calls NER API from Azure Text Analytics to identify, categorize, and redact sensitive information in text.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Input to NER API.
 *         in: body
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *              type: string
 *           example: {"PIIText": [" ashok mobile number is 555-555-5555"]}
 *     responses:
 *       200:
 *         description: Successfully retrieved response
 */

app.post("/Pii", async (req, res) => {
  let piiRecognition = req.body.PIIText;
  console.log(piiRecognition);
  const entityResults = await textAnalyticsClient.recognizePiiEntities(
    piiRecognition
  );

  res.json(entityResults);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
