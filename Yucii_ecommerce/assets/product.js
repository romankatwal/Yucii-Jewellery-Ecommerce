'use strict';

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("Product ID:", productId);

if (!productId) {

    console.error("No product ID found in URL");

} else {

    fetch(`http://localhost:5000/api/products/${productId}`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Product not found");
            }

            return response.json();

        })

        .then(product => {

            console.log("Product received:", product);

            document.querySelector("#product-name").textContent =
                product.name;

            document.querySelector("#product-category").textContent =
                product.category;

            document.querySelector("#product-price").textContent =
                `Rs ${product.price}`;

            document.querySelector("#product-description").textContent =
                product.description;

            document.querySelector("#product-stock").textContent =
                product.stock;

            document.querySelector("#product-image").src =
                product.image;

            document.querySelector("#product-image").alt =
                product.name;

        })

        .catch(error => {

            console.error("Error loading product:", error);

        });

}