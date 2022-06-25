// Variables
const es6Renderer = require("express-es6-template-engine");
const express = require('express');
const app = express();
const PORT = 3000;
const { User, Cocktail, Ingredient } = require('./models');
const axios = require('axios');
// Middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded());

// express-es6-template-engine set up
app.engine('html', es6Renderer); // Registers HTML as the engine (this is what type of view will be rendering. )
app.set('views', 'templates'); // The templates folder is where our "views" will be located. 
app.set('view engine', 'html'); // the engine we set up on line 15 will be used here. 




// ROUTING
/* Get Routes */
app.get('/home', async (req, res) => {
    const ingredients = await Ingredient.findAll({raw:true});
    console.log(ingredients);
    res.render('index', {
        locals: {
            ingredients: ingredients
        }
    })
})
app.get('/new-ingredient', async (req, res) => {
    res.render('newingredient')
})

app.get('/users', async (req, res) => {
    const users = await User.findAll();
    console.log(users)
    res.json(users);
});
app.get('/cocktails', async (req, res) => {
    const cocktails = await Cocktail.findAll();
    res.json(cocktails);
});
app.get('/ingredients', async (req, res) => {
    const ingredients = await Ingredient.findAll();
    res.json(ingredients);
});

/* Post Routes */
app.post('/ingredients', async (req, res) => {
    const { name } = req.body;
    const newIngredient = await Ingredient.create({
        name,
    })
    res.json(newIngredient);
})
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const newUser = await User.create({
        name,
        email
    })
    res.json(newUser);
})
app.post('/cocktails', async (req, res) => {
    const { name, spirit, citrus, sweetener, shake, creatorId } = req.body;
    const newCocktail = await Cocktail.create({
        name,
        spirit,
        citrus,
        sweetener,
        shake,
        creatorId
    })
    res.json(newCocktail);
})


app.listen(PORT, console.log(`Server is listening on port: ${PORT}`));

