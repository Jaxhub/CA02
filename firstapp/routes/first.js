const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Configuration, OpenAIApi} = require('openai');
require ('dotenv').config();
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openaiClient = new OpenAIApi(configuration);

router.get('/link', function(req, res) {
  res.render('link', { result: null });
});

// Use body-parser middleware to parse request body
router.use(bodyParser.urlencoded({ extended: true }));

// Handle POST request to '/link/play' endpoint
router.post('/link/play', (req, res) => {
  const playerChoice = req.body.choice; // Extract selected option value from request body
  const computerChoice = getComputerChoice(); // Get computer choice using the OpenAI API
  const result = getResult(playerChoice, computerChoice); // Determine game result
  console.log(openaiClient);
  console.log(`Player selected ${playerChoice}, Computer selected ${computerChoice}, Result: ${result}`); // Print game information to console for testing purposes
  res.render('result', { result: result });  // Render link.ejs file and pass result variable to it
});

// Function to get a random computer choice using the OpenAI API
async function getComputerChoice() {
  const prompt = "Select one of the following: rock, paper, scissors.";
  const model = "text-davinci-002"; // You can experiment with different models
  const promptOptions = {
    engine: 'davinci',
    prompt: prompt,
    maxTokens: 1,
    n: 1,
    stop: "\n",
    temperature: 0.7
  };
  const response = await openaiClient.completions.create(promptOptions);
  const computerChoice = response.choices[0].text.trim();
  return computerChoice;
}

// Function to determine the game result
function getResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'It\'s a tie!';
  } else if (playerChoice === 'rock' && computerChoice === 'scissors' ||
             playerChoice === 'paper' && computerChoice === 'rock' ||
             playerChoice === 'scissors' && computerChoice === 'paper') {
    return 'You win!';
  } else {
    return 'Computer wins!';
  }
}

module.exports = router;
