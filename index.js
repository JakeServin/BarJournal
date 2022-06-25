// Variables
const express = require('express');
const app = express();
const PORT = 3000;
const { User, Cocktail, Ingredient } = require('./models');

// Middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded());



// ROUTING
/* Get Routes */
app.get('/users', (req, res) => {
    const users = User.findAll();
    res.json(users);
});
app.get('/cocktails', (req, res) => {
    const cocktails = Cocktail.findAll();
    res.json(cocktails);
});
app.get('/ingredients', (req, res) => {
    const ingredients = Ingredient.findAll();
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

