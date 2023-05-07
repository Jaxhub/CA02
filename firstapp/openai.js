const {Configuration, OpenAIApi} = require('openai');
require ('dotenv').config();
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

async function generateCompletion(prompt) {
    const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: prompt,
        max_tokens: 64,
      });
    console.log(response.choices[0].text);
}
  

generateCompletion('Hello, my name is');
