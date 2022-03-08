// dependencies
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("firebase-admin");

//initialize
const app = express();

//configure server settings
require("dotenv").config();

// config variables from .env
const { MONGODB_URL, PORT, GOOGLE_CREDENTIALS } = process.env;

// const serviceAccount = JSON.parse(GOOGLE_CREDENTIALS);

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// connect to mongoDB
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// mongoDB event listener
const db = mongoose.connection;

db
    .on("connected", () => console.log("Connected to MongoDB"))
    .on("disconnected", () => console.log("Disconnected from MongoDB"))
    .on("error", (err) => console.log("MongoDB Error: " + err.message));

// model
const movieSchema = new mongoose.Schema (
    {
        title: String,
    },
    {
        timestamps: true,
    }
);

const Movie = mongoose.model("Movie", movieSchema);

// mount middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// app.use(async function (req, res, next) {
//     try {
//         const token = req.get("Authorization");
//         if (!token) return next();

//         const user = await admin.auth().verifyIdToken(token.replace("Bearer", ""));
//         if (!user) throw new Error("something went wrong");

//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(400).json(error);
//     }
// });

// function isAuthenticated(req, res, next) {
//     if (!req.user) return res.status(401).json({ message: "You must be logged in to add a movie"})
//     next();
// }

// ROUTES

//index
app.get("/movies", async (req, res) => {
    try {
        res.json(await Movie.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

//create
app.post("/movies", async (req, res) => {
    try {
        res.json(await Movie.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});






// listen
app.listen(PORT, () => {
    console.log(`Listenting on port ${PORT}`);
});