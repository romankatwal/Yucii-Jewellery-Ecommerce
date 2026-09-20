'use strict';

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const productImage = document.getElementById('product-image');
const productCategory = document.getElementById('product-category');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const productStock = document.getElementById('product-stock');

async function loadProduct() {

    if (!productId) {
        productName.textContent = 'Product not found';
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/products/${productId}`
        );

        if (!response.ok) {
            throw new Error('Product not found');
        }

        const product = await response.json();

        productImage.src = product.image;
        productImage.alt = product.name;

        productCategory.textContent = product.category;
        productName.textContent = product.name;
        productPrice.textContent = `Rs ${product.price}`;
        productDescription.textContent = product.description;
        productStock.textContent = product.stock;

    } catch (error) {

        console.error(error);
        productName.textContent = 'Unable to load product';

    }
}

loadProduct();