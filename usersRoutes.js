const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;

let usersRoutes = express.Router();

// #1 Retrieve All
// http://localhost:3000/users
usersRoutes.route("/users").get(async (req, res) => {
    let db = database.getDb();
    let data = await db.collection("users").find({}).toArray();
    if (data.length > 0) {
        res.json(data);
    } else {
        throw new Error("Data was not found :(")
    }
})

//#2 Retrieve One
usersRoutes.route("/users/:id").get(async (req, res) => {
    let db = database.getDb();
    let data = await db.collection("users").findOne({_id: new ObjectId(req.params.id)});
    if (Object.keys(data).length > 0) {
        res.json(data);
    } else {
        throw new Error("Data was not found :(")
    }
})
//#3 Create One
//#4 Update One
//#5 Delete One


module.exports = usersRoutes;