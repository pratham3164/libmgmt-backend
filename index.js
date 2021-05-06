const express = require("express");
const bodyParser = require("body-parser");

const routes = require("./route/routes");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(routes);

app.get;

app.listen(3003);
