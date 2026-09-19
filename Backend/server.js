const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Yucii Backend is running 🚀");
});

// Server port
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Yucii Backend running on http://localhost:${PORT}`);
});