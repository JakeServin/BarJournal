// Variables
const es6Renderer = require("express-es6-template-engine");
const express = require('express');
const app = express();
const PORT = 3000;
const { User, Cocktail, Ingredient } = require('./models');
const axios = require('axios');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const passport = require('passport');
const session = require('express-session');
const bCrypt = require('bcrypt-nodejs')




// Middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(
	session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
); // session secret

app.use(passport.initialize());

app.use(passport.session()); 

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findByPk(id).then(function (user) {
		if (user) {
			done(null, user.get());
		} else {
			done(user.errors, null);
		}
	});
});

passport.use('local-signup', new LocalStrategy(
        {
 
            usernameField: 'name',
 
            passwordField: 'password',
 
            passReqToCallback: true // allows us to pass back the entire request to the callback
 
    },
    
 
 
    function (req, name, password, done) {
 
            var generateHash = function(password) {
 
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
 
            };
 
 
 
            User.findOne({
                where: {
                    name: name
                }
            }).then(function(user) {
 
                if (user)
 
                {
 
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
 
                } else
 
                {
 
                    var userPassword = generateHash(password);
 
                    var data =
 
                        {
                            name: req.body.name,
 
                            password: userPassword,
 
                        };
 
                    User.create(data).then(function(newUser, created) {
 
                        if (!newUser) {
 
                            return done(null, false);
 
                        }
 
                        if (newUser) {
 
                            return done(null, newUser);
 
                        }
 
                    });
 
                }
 
            });
 
        }
 
    ));



// express-es6-template-engine set up
app.engine('html', es6Renderer); // Registers HTML as the engine (this is what type of view will be rendering. )
app.set('views', 'templates'); // The templates folder is where our "views" will be located. 
app.set('view engine', 'html'); // the engine we set up on line 15 will be used here. 




// ROUTING
/* Get Routes */

app.get('/home', async (req, res) => {
    const cocktails = await Cocktail.findAll({ raw: true });
    const ingredients = await Ingredient.findAll({ raw: true });
    res.render('index', {
        locals: {
            cocktails: cocktails,
            ingredients: ingredients
        },
        partials: {
            navbar: './templates/partials/nav.html'
        }
    })
})
app.get('/new-cocktail', async (req, res) => {
    const ingredients = await Ingredient.findAll({ raw: true });
    const cocktails = await Cocktail.findAll({ raw: true });
    res.render('newcocktail', {
        locals: {
            ingredients: ingredients,
            cocktails: cocktails
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
    const { name, spirit, citrus, sweetener, shake, creatorId, description, url, spiritAmount, citrusAmount, sweetenerAmount } = req.body;
    const newCocktail = await Cocktail.create({
        name,
        spirit,
        citrus,
        sweetener,
        shake,
        creatorId,
        description,
        url,
        spiritAmount,
        citrusAmount,
        sweetenerAmount
    })
    res.json(newCocktail);
})

app.post(
	"/signup",
	passport.authenticate("local-signup", {
		successRedirect: "/cocktails",

		failureRedirect: "/ingredients",
	})
);


app.listen(
	PORT,
	console.log(`Server is listening on port: ${PORT}`)
);

