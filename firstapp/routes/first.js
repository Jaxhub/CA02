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
router.post('/link/play', async (req, res) => {
  const playerChoice = req.body.choice; // Extract selected option value from request body
  const computerChoice = await getComputerChoice(); // Get computer choice using the OpenAI API
  const result = getResult(playerChoice, computerChoice); // Determine game result
  res.render('result', { result: result });  // Render link.ejs file and pass result variable to it
});

async function getComputerChoice() { // Function to get a random computer choice using the OpenAI API
  const response = await openaiClient.createCompletion({
    model: "text-davinci-003",
    prompt: "Generate a random move for rock paper scissors.",
    max_tokens: 16,
    n: 1,
    temperature: 0.8,
  })
  return response.data.choices[0].text.trim().toLowerCase();
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
