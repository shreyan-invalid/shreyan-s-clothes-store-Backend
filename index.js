
const express = require('express');
const app = express();
const cors= require("cors");
require('dotenv').config({path: './.env'});
const createCheckoutSession= require('./api/checkout');
const webhook = require('./api/webhook');


app.use(express.json({
  verify: (req, res, buffer) => req['rawBody']= buffer,
}));

app.use(cors({ origin:true }));

const port= 4000;



app.get("/", (req, res) => {
  res.send("IT WORKS");
} )

app.post('/webhook', webhook);

app.post('/create-checkout-session', createCheckoutSession);



app.listen(port, () => console.log('Running on port port', port));