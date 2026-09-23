'use strict';

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("Product ID:", productId);

if (!productId) {

    console.error("No product ID found in URL");

} else {

    // Ask backend for this product
    fetch(`http://localhost:5000/api/products/${productId}`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Product not found");
            }

            return response.json();

        })

        .then(product => {

            console.log("Product received:", product);

            // PRODUCT IMAGE
            const image = document.getElementById("product-image");

            if (image) {
                image.src = product.image;
                image.alt = product.name;
            }


            // PRODUCT CATEGORY
            const category = document.getElementById("product-category");

            if (category) {
                category.textContent = product.category;
            }


            // PRODUCT NAME
            const name = document.getElementById("product-name");

            if (name) {
                name.textContent = product.name;
            }


            // PRODUCT PRICE
            const price = document.getElementById("product-price");

            if (price) {
                price.textContent = `Rs ${product.price}`;
            }


            // PRODUCT DESCRIPTION
            const description = document.getElementById("product-description");

            if (description) {
                description.textContent = product.description;
            }


            // PRODUCT STOCK
            const stock = document.getElementById("product-stock");

            if (stock) {
                stock.textContent = product.stock;
            }

        })

        .catch(error => {

            console.error("Error loading product:", error);

        });

}