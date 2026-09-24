"use strict";

/* =========================================
   GET PRODUCT ID FROM URL
========================================= */

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("Product ID:", productId);


/* =========================================
   ELEMENTS
========================================= */

const productName = document.getElementById("product-name");
const productCategory = document.getElementById("product-category");
const productPrice = document.getElementById("product-price");
const productDescription = document.getElementById("product-description");
const productStock = document.getElementById("product-stock");
const productImage = document.getElementById("product-image");

const breadcrumbCategory =
    document.getElementById("breadcrumb-category");

const breadcrumbName =
    document.getElementById("breadcrumb-name");

const quantityDisplay =
    document.getElementById("quantity");

const decreaseButton =
    document.getElementById("decrease-btn");

const increaseButton =
    document.getElementById("increase-btn");

const addCartButton =
    document.querySelector(".add-cart-btn");

const buyNowButton =
    document.querySelector(".buy-now-btn");


/* =========================================
   QUANTITY
========================================= */

let quantity = 1;
let availableStock = 0;


/* =========================================
   LOAD PRODUCT
========================================= */

if (!productId) {

    console.error("No product ID found in URL");

    if (productName) {
        productName.textContent = "Product not found";
    }

} else {

    console.log(
        `Getting product ${productId} from backend...`
    );

    fetch(`http://localhost:5000/api/products/${productId}`)

        .then(response => {

            console.log("Backend response:", response);

            if (!response.ok) {
                throw new Error(
                    `Product not found. Status: ${response.status}`
                );
            }

            return response.json();
        })


        .then(product => {

            console.log("Product received:", product);


            /* =================================
               PRODUCT NAME
            ================================= */

            if (productName) {
                productName.textContent = product.name;
            }


            /* =================================
               PRODUCT CATEGORY
            ================================= */

            if (productCategory) {
                productCategory.textContent = product.category;
            }


            /* =================================
               BREADCRUMB CATEGORY
            ================================= */

            if (breadcrumbCategory) {
                breadcrumbCategory.textContent =
                    product.category;
            }


            /* =================================
               BREADCRUMB PRODUCT NAME
            ================================= */

            if (breadcrumbName) {
                breadcrumbName.textContent =
                    product.name;
            }


            /* =================================
               PRODUCT PRICE
            ================================= */

            if (productPrice) {

                const price =
                    Number(product.price).toFixed(2);

                productPrice.textContent =
                    `Rs ${price}`;

            }


            /* =================================
               PRODUCT DESCRIPTION
            ================================= */

            if (productDescription) {

                productDescription.textContent =
                    product.description ||
                    "No description available.";

            }


            /* =================================
               PRODUCT STOCK
            ================================= */

            availableStock =
                Number(product.stock) || 0;

            if (productStock) {
                productStock.textContent =
                    availableStock;
            }


            /* =================================
               PRODUCT IMAGE
            ================================= */

            if (productImage && product.image) {

                productImage.src = product.image;
                productImage.alt = product.name;

            }


            /* =================================
               INITIAL QUANTITY
            ================================= */

            quantity = 1;

            if (quantityDisplay) {
                quantityDisplay.textContent =
                    quantity;
            }


            /* =================================
               STOCK MESSAGE
            ================================= */

            if (availableStock <= 0) {

                if (productStock) {
                    productStock.textContent =
                        "Out of stock";

                    productStock.style.color =
                        "#d9534f";
                }

                if (addCartButton) {
                    addCartButton.disabled = true;
                    addCartButton.textContent =
                        "Out of Stock";
                    addCartButton.style.opacity =
                        "0.6";
                    addCartButton.style.cursor =
                        "not-allowed";
                }

                if (buyNowButton) {
                    buyNowButton.disabled = true;
                    buyNowButton.style.opacity =
                        "0.6";
                    buyNowButton.style.cursor =
                        "not-allowed";
                }

            }


            /* =================================
               LOW STOCK
            ================================= */

            else if (availableStock <= 5) {

                if (productStock) {

                    productStock.textContent =
                        `${availableStock} left`;

                    productStock.style.color =
                        "#d98c00";
                }

            }

        })


        /* =====================================
           ERROR
        ===================================== */

        .catch(error => {

            console.error(
                "Error loading product:",
                error
            );

            if (productName) {
                productName.textContent =
                    "Unable to load product";
            }

            if (productCategory) {
                productCategory.textContent =
                    "";
            }

            if (productPrice) {
                productPrice.textContent =
                    "";
            }

            if (productDescription) {
                productDescription.textContent =
                    "Something went wrong while loading this product.";
            }

        });

}


/* =========================================
   DECREASE QUANTITY
========================================= */

if (decreaseButton) {

    decreaseButton.addEventListener(
        "click",
        () => {

            if (quantity > 1) {

                quantity--;

                if (quantityDisplay) {
                    quantityDisplay.textContent =
                        quantity;
                }

            }

        }
    );

}


/* =========================================
   INCREASE QUANTITY
========================================= */

if (increaseButton) {

    increaseButton.addEventListener(
        "click",
        () => {

            if (availableStock > 0) {

                if (quantity < availableStock) {

                    quantity++;

                    if (quantityDisplay) {
                        quantityDisplay.textContent =
                            quantity;
                    }

                } else {

                    alert(
                        `Only ${availableStock} item(s) available in stock.`
                    );

                }

            }

        }
    );

}


/* =========================================
   ADD TO CART
========================================= */

if (addCartButton) {

    addCartButton.addEventListener(
        "click",
        () => {

            if (!productId) {
                return;
            }

            if (availableStock <= 0) {

                alert("This product is out of stock.");
                return;

            }

            const cartItem = {

                productId: productId,

                quantity: quantity

            };

            console.log(
                "Added to cart:",
                cartItem
            );

            alert(
                `Added ${quantity} item(s) to cart!`
            );

        }
    );

}


/* =========================================
   BUY NOW
========================================= */

if (buyNowButton) {

    buyNowButton.addEventListener(
        "click",
        () => {

            if (!productId) {
                return;
            }

            if (availableStock <= 0) {

                alert("This product is out of stock.");
                return;

            }

            console.log(
                "Buy Now:",
                {
                    productId: productId,
                    quantity: quantity
                }
            );

            alert(
                `Proceeding to checkout with ${quantity} item(s).`
            );

        }
    );

}


/* =========================================
   IMAGE ERROR HANDLING
========================================= */

if (productImage) {

    productImage.addEventListener(
        "error",
        () => {

            console.error(
                "Product image could not be loaded:",
                productImage.src
            );

        }
    );

}