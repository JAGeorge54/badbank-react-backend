const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const users = require("./usersRoutes");
require("dotenv").config({path: "./config.env"});

const app = express();

app.use(cors());
app.use(express.json());
app.use(users);

app.listen(process.env.PORT, () => {
    connect.connectToServer()
    console.log(`Server is running on port: ${process.env.PORT}`)
})