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
usersRoutes.route("/users").post(async (req, res) => {
    let db = database.getDb();
    let mongoObject = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        balance: req.body.balance,
        admin: req.body.admin,
        history: [100]
    };
    let data = await db.collection("users").insertOne(mongoObject);
    res.json(data);
})

//#4 Update One
usersRoutes.route("/users/:id").put(async (req, res) => {
    let db = database.getDb();
    let mongoObject = {
        $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            balance: req.body.balance,
            admin: req.body.admin,
            history: [100]
        }
    };
    let data = await db.collection("users").updateOne({_id: new ObjectId(req.params.id)}, mongoObject);
    res.json(data);
})

//#5 Delete One


module.exports = usersRoutes;