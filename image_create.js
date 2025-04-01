/**
 * TODO(developer): Update these variables before running the sample.
 */
// const projectId = process.env.CAIP_PROJECT_ID;
const projectId = 'test-ai-march-28th';
const location = 'us-central1';
// const prompt = 'a dog reading a newspaper';
const prompt = 'a yellow flower in a forest';


// import { aiplatform } from '@google-cloud/aiplatform';
import * as aiplatform from '@google-cloud/aiplatform';
// const { aiplatform } = require('@google-cloud/aiplatform');

import * as fs from 'fs';
// const fs = require('fs');
import * as util from 'util';
// const util = require('util');

// Imports the Google Cloud Prediction Service Client library
const { PredictionServiceClient } = aiplatform.v1;

// Import the helper module for converting arbitrary protobuf.Value objects
const { helpers } = aiplatform;

// Specifies the location of the api endpoint
const clientOptions = {
  apiEndpoint: `${location}-aiplatform.googleapis.com`,
};

// Instantiates a client
const predictionServiceClient = new PredictionServiceClient(clientOptions);

async function generateImage() {
    // const fs = require('fs');
    // const util = require('util');


    // Configure the parent resource
    const endpoint = `projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001`;

    const promptText = {
        // The text prompt describing what you want to see
        prompt: prompt,
    };
    const instanceValue = helpers.toValue(promptText);
    const instances = [instanceValue];

    const parameter = {
        sampleCount: 1,
        // You can't use a seed value and watermark at the same time.
        // seed: 100,
        // addWatermark: false,
        aspectRatio: '1:1',
        safetyFilterLevel: 'block_some',
        // personGeneration: 'allow_adult',
        personGeneration: 'dont_allow'
    };
    const parameters = helpers.toValue(parameter);

    const request = {
        endpoint,
        instances,
        parameters,
    };

    // Predict request
    const [response] = await predictionServiceClient.predict(request);
    const predictions = response.predictions;
    if (predictions.length === 0) {
      console.log(
        'No image was generated. Check the request parameters and prompt.'
      );
    } else {

      // let i = 1;
      // generate random number append to name of image file
      let i = Math.ceil(Math.random() * 100);

      for (const prediction of predictions) {
        const buff = Buffer.from(
            prediction.structValue.fields.bytesBase64Encoded.stringValue,
            'base64'
        );

        // Write image content to the output file
        const writeFile = util.promisify(fs.writeFile);
        const filename = `output${i}.png`;
        await writeFile(filename, buff);

        console.log(`Saved image ${filename}`);
        i++;
      }
    }
}
await generateImage();