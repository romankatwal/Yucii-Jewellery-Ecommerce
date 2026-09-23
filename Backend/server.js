const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// =====================================
// FRONTEND
// =====================================

const frontendPath = path.join(__dirname, "../Yucii_ecommerce");

console.log("Frontend path:", frontendPath);

app.use(express.static(frontendPath));

app.get("/product.html", (req, res) => {
    res.sendFile(path.join(frontendPath, "product.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});


// =====================================
// API
// =====================================

app.get("/api", (req, res) => {
    res.send("Yucii Backend is running 🚀");
});


// GET ALL PRODUCTS
app.get("/api/products", (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Database error:", err);

            return res.status(500).json({
                message: "Failed to fetch products"
            });
        }

        res.json(results);
    });
});


// GET ONE PRODUCT
app.get("/api/products/:id", (req, res) => {

    const productId = req.params.id;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [productId], (err, results) => {

        if (err) {
            console.error("Database error:", err);

            return res.status(500).json({
                message: "Failed to fetch product"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(results[0]);
    });
});


// =====================================
// START SERVER
// =====================================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Yucii Backend running on http://localhost:${PORT}`);
    console.log(`Frontend available at http://localhost:${PORT}/`);
});