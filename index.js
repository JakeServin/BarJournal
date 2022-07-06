// Variables
const es6Renderer = require ('express-es6-template-engine');
const express = require ('express');
const app = express ();
const PORT = 4000;
const {User, Cocktail, Ingredient} = require ('./models');
const LocalStrategy = require ('passport-local').Strategy;
const passport = require ('passport');
const session = require ('express-session');
const bCrypt = require ('bcrypt-nodejs');

// Middleware
app.use (express.static (__dirname + '/public'));
app.use (express.json ());
app.use (express.urlencoded ());
app.use (
  session ({secret: 'keyboard cat', resave: true, saveUninitialized: true})
); // session secret

app.use (passport.initialize ());

app.use (passport.session ());
app.use ((err, req, res, next) => {
  console.error (err.stack);
  res.status (500).send ('Something broke!');
});

passport.serializeUser (function (user, done) {
  done (null, user.id);
});

passport.deserializeUser (function (id, done) {
  User.findByPk (id).then (function (user) {
    if (user) {
      done (null, user.get ());
    } else {
      done (user.errors, null);
    }
  });
});

passport.use (
  'local-signin',
  new LocalStrategy (
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'name',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    function (req, name, password, done) {
      var isValidPassword = function (userpass, password) {
        return bCrypt.compareSync (password, userpass);
      };
      User.findOne ({
        where: {
          name: name,
        },
      })
        .then (function (user) {
          if (!user) {
            return done (null, false, {
              message: 'Username does not exist',
            });
          }
          if (!isValidPassword (user.password, password)) {
            return done (null, false, {
              message: 'Incorrect password.',
            });
          }
          var userinfo = user.get ();
          return done (null, userinfo);
        })
        .catch (function (err) {
          console.log ('Error:', err);
          return done (null, false, {
            message: 'Something went wrong with your Signin',
          });
        });
    }
  )
);
passport.use (
  'local-signup',
  new LocalStrategy (
    {
      usernameField: 'name',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    function (req, name, password, done) {
      var generateHash = function (password) {
        console.log (password);
        return bCrypt.hashSync (password, bCrypt.genSaltSync (8), null);
      };
      User.findOne ({
        where: {
          name: name,
        },
      }).then (function (user) {
        if (user) {
          return done (null, false, {
            message: 'That email is already taken',
          });
        } else {
          var userPassword = generateHash (password);
          var data = {
            name: req.body.name,
            password: userPassword,
            email: req.body.email,
          };
          User.create (data).then (function (newUser, created) {
            if (!newUser) {
              return done (null, false);
            }
            if (newUser) {
              return done (null, newUser);
            }
          });
        }
      });
    }
  )
);
// express-es6-template-engine set up
app.engine ('html', es6Renderer); // Registers HTML as the engine (this is what type of view will be rendering. )
app.set ('views', 'templates'); // The templates folder is where our "views" will be located.
app.set ('view engine', 'html'); // the engine we set up on line 15 will be used here.

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated ()) return next ();

  res.redirect ('/signin');
}

// ROUTING
/* Get Routes */

app.get ('/', async (req, res) => {
  const cocktails = await Cocktail.findAll ({raw: true});
  const ingredients = await Ingredient.findAll ({raw: true});
    const users = await User.findAll({ raw: true });
  res.render ('home', {
    locals: {
      cocktails: cocktails,
      users: users,
          ingredients: ingredients,
    },
    partials: {
      navbar: './templates/partials/nav.html',
    },
  });
  console.log(userInfo)
}); 
app.get ('/dashboard', isLoggedIn, async (req, res) => {
  const cocktails = await Cocktail.findAll ({raw: true});
  const ingredients = await Ingredient.findAll ({raw: true});
    const users = await User.findAll({ raw: true });
    const userInfo = await User.findOne({
		raw: true,
		where: {
			id: req.user.id,
		},
		attributes: {
			exclude: ["password"],
		},
	});
  res.render ('dashboard', {
    locals: {
      cocktails: cocktails,
      users: users,
          ingredients: ingredients,
        userInfo:userInfo
    },
    partials: {
      navbar: './templates/partials/nav.html',
    },
  });
  console.log(userInfo)
}); 
app.get ('/new-cocktail', isLoggedIn, async (req, res) => {
  const ingredients = await Ingredient.findAll ({raw: true});
  const cocktails = await Cocktail.findAll ({raw: true});
  const userInfo = await User.findOne({
		raw: true,
		where: {
			id: req.user.id,
		},
		attributes: {
			exclude: ["password"],
		},
  });
  res.render ('newcocktail', {
    locals: {
      ingredients: ingredients,
      cocktails: cocktails,
      userInfo: userInfo
    },
  });
});
app.get('/new-ingredient', isLoggedIn, async (req, res) => {
    const userInfo = await User.findOne({
		raw: true,
		where: {
			id: req.user.id,
		},
		attributes: {
			exclude: ["password"],
		},
	});
    res.render('newingredient', {
        locals: {
            userInfo: userInfo
      }
  });
});
app.get ('/users/:creatorId', isLoggedIn, async (req, res) => {
  const ingredients = await Ingredient.findAll ({raw: true});
  const users = await User.findAll ({raw: true});
  const userCocktails = await Cocktail.findAll ({
    raw: true,
    where: {
      creatorId: req.params.creatorId,
    },
  });
    const userInfo = await User.findOne({
		raw: true,
		where: {
			id: req.user.id,
		},
		attributes: {
			exclude: ["password"],
		},
	});
  const creatorInfo = await User.findOne ({
    raw: true,
    where: {
      id: req.params.creatorId,
    },
    attributes: {
      exclude: ['password'],
    },
  });
    let activeFlag = '';
    if (creatorInfo.id == userInfo.id) {
        activeFlag = 'active';
    }
      

  console.log (userInfo);
  res.render ('usercocktails', {
    locals: {
      creatorInfo: creatorInfo,
      userInfo: userInfo,
      userCocktails: userCocktails,
      ingredients: ingredients,
        users: users,
      activeFlag:activeFlag
    },
  });
});
app.get ('/users', async (req, res) => {
  const users = await User.findAll ();
  console.log (users);
  res.json (users);
});
app.get ('/cocktails', async (req, res) => {
  const cocktails = await Cocktail.findAll ();
  res.json (cocktails);
});
app.get ('/ingredients', async (req, res) => {
  const ingredients = await Ingredient.findAll ();
  res.json (ingredients);
});

app.get ('/signup', async (req, res) => {
  res.render ('signup');
});
app.get ('/signin', async (req, res) => {
  res.render ('signin');
});
app.get ('/logout', (req, res) => {
  req.session.destroy (function (err) {
    res.redirect ('/');
  });
});

/* Post Routes */
app.post ('/ingredients', async (req, res) => {
  const {name} = req.body;
  const newIngredient = await Ingredient.create ({
    name,
  });
  res.json (newIngredient);
});
app.post ('/users', async (req, res) => {
  const {name, email} = req.body;
  const newUser = await User.create ({
    name,
    email,
  });
  res.json (newUser);
});
app.post ('/cocktails', async (req, res) => {
  let {
    name,
    spirit,
    citrus,
    sweetener,
    shake,
    description,
    url,
    spiritAmount,
    citrusAmount,
    sweetenerAmount,
  } = req.body;
  console.log (req.body);
  const creatorId = req.user.id;
  const newCocktail = await Cocktail.create ({
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
    sweetenerAmount,
  });
    console.log(newCocktail);
});

app.post (
  '/signup',
  passport.authenticate ('local-signup', {
    successRedirect: '/dashboard',

    failureRedirect: '/signup',
  })
);
app.post (
  '/signin',
  passport.authenticate ('local-signin', {
    successRedirect: '/dashboard',

    failureRedirect: '/signin',
  })
);

app.listen (PORT, console.log (`Server is listening on port: ${PORT}`));
