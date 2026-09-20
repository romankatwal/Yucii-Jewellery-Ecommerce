const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// ==========================================
// HOME / TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("Yucii Backend is running 🚀");
});


// ==========================================
// GET ALL PRODUCTS
// ==========================================

app.get("/api/products", (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Error fetching products:", err);

            return res.status(500).json({
                message: "Failed to fetch products"
            });
        }

        res.json(results);
    });
});


// ==========================================
// GET ONE PRODUCT BY ID
// ==========================================

app.get("/api/products/:id", (req, res) => {

    const productId = req.params.id;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [productId], (err, results) => {

        if (err) {
            console.error("Error fetching product:", err);

            return res.status(500).json({
                message: "Failed to fetch product"
            });
        }

        // Product doesn't exist
        if (results.length === 0) {

            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Send the first matching product
        res.json(results[0]);
    });
});


// ==========================================
// START SERVER
// ==========================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(`Yucii Backend running on http://localhost:${PORT}`);

});