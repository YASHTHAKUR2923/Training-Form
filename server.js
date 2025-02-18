require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "yash-db",
    password: "yash2923",
    port: 5432,
});


// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST - Save Form Data to Database
app.post("/submit-form", async (req, res) => {
    try {
        const { calendar, trainerName, otherTrainer, trainingDate, trainingTiming, trainingTimingEnd, trainingHead, trainingTopic, Location, referenceNo, employeeCode } = req.body;
        const result = await pool.query(
            "INSERT INTO training (calendar, trainerName, otherTrainer, trainingDate, trainingTiming, trainingTimingEnd, trainingHead, trainingTopic, Location, referenceNo, employeeCode) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
            [calendar, trainerName, otherTrainer, trainingDate, trainingTiming, trainingTimingEnd, trainingHead, trainingTopic, Location, referenceNo, employeeCode]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving data" });
    }
});

// GET - Fetch All Data
app.get("/get-data", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM training ORDER BY id DESC");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching data" });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
