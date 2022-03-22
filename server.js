// dependencies
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const methodOverride = require('method-override');
const admin = require("firebase-admin");

//initialize
const app = express();

//configure server settings
require("dotenv").config();

const PORT = process.env.PORT || 4000;

// config variables from .env
const MONGODB_URI = process.env.MONGODB_URI;

// connect to mongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
        image: String,
    },
    {
        timestamps: true,
    }
);

const Movies = mongoose.model("Movies", movieSchema);

// mount middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

// ROUTES
// app.get("/", async (res, res) => {
//     res.redirect("/movies");
// })

//index
app.get("/movies", async (req, res) => {
    try {
        res.json(await Movies.find(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

//create
app.post("/movies", async (req, res) => {
    try {
        res.json(await Movies.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

// listen
app.listen(PORT, () => {
    console.log(`Listenting on port ${PORT}`);
});