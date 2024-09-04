const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require("dotenv").config({path: "./config.env"});

let usersRoutes = express.Router();
const SALT_ROUNDS = 6;

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

    const emailTaken = await db.collection("users").findOne({email: req.body.email});

    if (emailTaken) {
        res.json({message: 'Email not available.'});
    } else {
        const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS)
    
        let mongoObject = {
            name: req.body.name,
            email: req.body.email,
            password: hash,
            balance: req.body.balance,
            admin: req.body.admin,
            history: [req.body.balance]
        };
        let data = await db.collection("users").insertOne(mongoObject);
        res.json(data);
    }

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
            history: req.body.history
        }
    };
    let data = await db.collection("users").updateOne({_id: new ObjectId(req.params.id)}, mongoObject);
    res.json(data);
})

//#5 Delete One
usersRoutes.route("/users/:id").delete(verifyToken, async (req, res) => {
    let db = database.getDb();
    let data = await db.collection("users").deleteOne({_id: new ObjectId(req.params.id)});
    res.json(data);
})

usersRoutes.route("/users/login").post(async (req, res) => {
    let db = database.getDb();

    const user = await db.collection("users").findOne({email: req.body.email});

    if (user) {
        let confirmation = await bcrypt.compare(req.body.password, user.password);
        if (confirmation) {
            const token = jwt.sign(user, process.env.SECRETKEY, {expiresIn: '1h'})
            res.json({success: true, token})
        } else {
            res.json({success:false, message: 'Incorrect Password.'})
        }
    } else {
        res.json({success: false, message: 'User not found.'});
    }

})

function verifyToken(req, res, next) {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: "Authentication token is missing."});
    }

    jwt.verify(token, process.env.SECRETKEY, (error, user) => {
        if (error) {
            return res.status(403).json({message: "Invalid Token."})
        }

        req.body.user = user;
        next()
    })
}

module.exports = usersRoutes;