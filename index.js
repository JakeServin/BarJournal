// Variables
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(urlencoded());



// ROUTING
/* Get Routes */
app.get('/', () => {
    
})
