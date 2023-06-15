const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Configuration, OpenAIApi} = require('openai');
require ('dotenv').config();
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openaiClient = new OpenAIApi(configuration);
const wish = require('../models/Wish');
const fs = require('fs');
const { clear } = require('console');

let pokemon = [];
let filePath = "";

router.get('/wishlist', function (req, res) {
    res.render('wishlist', { pokemon: pokemon });
});

router.use(bodyParser.urlencoded({ extended: true }));
  
router.post ('/wishlist', async (req, res) => { //this is meant to generate the pokemon team
    pokemon = [];
    for(i = 0; i < 6; i++){
        const mon = await openaiClient.createCompletion({
            model: "text-davinci-003",
            prompt: "Generate a random pokémon. Please only generate the pokémon's name.",
            max_tokens: 16,
            n: 1,
            temperature: 0.8,
          })
        const abilty = await openaiClient.createCompletion({
            model: "text-davinci-003",
            prompt: "Generate a random ability from the pokémon games. Please only generate the name of the ability.",
            max_tokens: 16,
            n: 1,
            temperature: 0.8,
            })
        const type1 = await openaiClient.createCompletion({
            model: "text-davinci-003",
            prompt: "Generate a random type from the pokémon games. Please only generate the name of the type.",
            max_tokens: 16,
            n: 1,
            temperature: 0.8,
            })
        const type2 = await openaiClient.createCompletion({
            model: "text-davinci-003",
            prompt: "Generate a random type from the pokémon games. Please only generate the name of the type.",
            max_tokens: 16,
            n: 1,
            temperature: 0.8,
            })
        const mondata = {
            id : Date.now(),
            pokemon: mon.data.choices[0].text.trim(),
            ability: abilty.data.choices[0].text.trim(),
            type1: type1.data.choices[0].text.trim(),
            type2: type2.data.choices[0].text.trim()
        }
        pokemon.push(mondata);
    }
    res.redirect('/wishlist');
});

router.post('/wishlist/save',  (req, res) => { //this is meant to save the pokemon team
    if (!fs.existsSync('./data')) { //creates a folder called data if it doesn't exist
        fs.mkdirSync('./data');
    }
    const fileName = req.body.fileName;
    filePath = './data/' + fileName + '.json';
    fs.writeFileSync(filePath, JSON.stringify(pokemon));
    res.send("Your Pokémon team has been saved as "  + fileName + " !");
});

router.get('/wishlist/display', (req, res) => { //this is meant to display the pokemon team
    const teamID = req.query.teamID;
    const teamPath = `./data/${teamID}.json`;

    if (fs.existsSync(teamPath)) {
        const data = fs.readFileSync(teamPath);
        const pokemon = JSON.parse(data);
        res.render('wishlist', { pokemon: pokemon });
    } else {
        res.send('No Pokémon team found with the specified ID. <a href="/wishlist">Go back</a>');
    }
});

router.get('/wishlist/delete', (req, res) => { //this is meant to delete the pokemon team
    const teamID = req.query.teamID;
    const teamPath = `./data/${teamID}.json`;

    if (fs.existsSync(teamPath)) {
        fs.unlinkSync(teamPath);
        res.send(`Pokémon team with ID ${teamID} has been deleted. <a href="/wishlist">Go back</a>`);
    } else {
        res.send('No Pokémon team found with the specified ID. <a href="/wishlist">Go back</a>');
    }
});

module.exports = router;
