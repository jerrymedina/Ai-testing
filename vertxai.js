const {
  FunctionDeclarationSchemaType,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} = require('@google-cloud/vertexai');

// import {
//   FunctionDeclarationSchemaType,
//   HarmBlockThreshold,
//   HarmCategory,
//   VertexAI
// } from '@google-cloud/vertexai';

// **important** - project needs to match name on create on google cloud
const project = 'test-ai-march-28th';
const location = 'us-central1';
const textModel =  'gemini-2.0-flash-lite';
//'gemini-2.5-pro-exp-03-25'; // 'gemini-1.0-pro';
const visionModel = 'gemini-1.0-pro-vision';


console.log("Using project: ", project);
console.log("Using textModel: ", textModel);
console.log("Using visionModel: ", visionModel);


const vertexAI = new VertexAI({ project: project, location: location });

// Instantiate Gemini models
const generativeModel = vertexAI.getGenerativeModel({
    model: textModel,
    // The following parameters are optional
    // They can also be passed to individual content generation requests
    safetySettings: [{
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, 
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }],
    generationConfig: { maxOutputTokens: 256 },
    systemInstruction: {
        role: 'system',
        parts: [{
          "text": `For example, you are a helpful customer service agent.`
        }]
    },
});

const generativeVisionModel = vertexAI.getGenerativeModel({
    model: visionModel,
});

const generativeModelPreview = vertexAI.preview.getGenerativeModel({
    model: textModel,
});

// TODO: change text so it takes whatever user inputs when nodejs is run
// const myQuestion = 'How are you today?';
// const myQuestion = '日本語が分かりますか?';
const myQuestion = 'Can you name me 10 colors?';
console.log('My question: ', myQuestion);


async function streamGenerateContent() {
    // const chat = generativeModel.startChat({
    //   tools: functionDeclarations,
    // });

    const request = {
        contents: [{
            role: 'user', 
            parts: [{ text: myQuestion }]
        }],
    };
    const streamingResult = await 


    generativeModel.generateContentStream(request);

    // for await (const item of streamingResult.stream) {

    //     console.log('stream chunk: ', JSON.stringify(item));
    //     // try to make this more readable
    //     console.log('\n'); 

    // }
    const aggregatedResponse = await streamingResult.response;

    console.log('aggregated response: ', JSON.stringify(aggregatedResponse));

    // Note; the index [0] is hardcoded but dont know if this could change
    const reply = aggregatedResponse.candidates[0].content.parts[0].text;

    // final response:
    console.log('Ai reply:', reply);
    // console.log('aggregatedResponse.candidates[0].content.parts', aggregatedResponse.candidates[0].content.parts);

};

streamGenerateContent();
