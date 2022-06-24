// Variables
const express = require('express');
const app = express();
const PORT = 3000;
const { User, Cocktail, Ingredient } = require('./models');

// Middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded());




app.listen(PORT, console.log(`Server is listening on port: ${PORT}`));

