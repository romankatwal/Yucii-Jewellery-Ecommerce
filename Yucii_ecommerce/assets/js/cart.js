
"use strict";

document.addEventListener("DOMContentLoaded", loadCart);

/* =========================================
   CART HELPERS
========================================= */

function getCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem("yuciiCart") || "[]"
        );

        return Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
        console.error("Unable to read cart:", error);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("yuciiCart", JSON.stringify(cart));
}

/* =========================================
   LOAD CART
========================================= */

async function loadCart() {
    const cartContent = document.getElementById("cart-content");

    if (!cartContent) return;

    const cart = getCart();

    if (cart.length === 0) {
        showEmptyCart(cartContent);
        return;
    }

    cartContent.innerHTML = "<p>Loading your cart...</p>";

    try {
        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Could not load products.");
        }

        const products = await response.json();

        // Keep only valid cart items.
        const validCart = cart.filter(item =>
            products.some(product =>
                String(product.id) === String(item.productId)
            )
        );

        if (validCart.length !== cart.length) {
            saveCart(validCart);
        }

        if (validCart.length === 0) {
            showEmptyCart(cartContent);
            return;
        }

        renderCart(cartContent, validCart, products);

    } catch (error) {
        console.error("Cart loading error:", error);

        cartContent.innerHTML = `
            <div class="empty-cart">
                <p>Unable to load your cart.</p>
                <button class="continue-shopping"
                    onclick="loadCart()">
                    Try Again
                </button>
            </div>
        `;
    }
}

/* =========================================
   EMPTY CART
========================================= */

function showEmptyCart(container) {
    container.innerHTML = `
        <div class="empty-cart">
            <p>Your shopping cart is empty 🛒</p>
            <a href="index.html" class="continue-shopping">
                Continue Shopping
            </a>
        </div>
    `;
}

/* =========================================
   RENDER CART
========================================= */

function renderCart(container, cart, products) {
    let subtotal = 0;

    const itemsHTML = cart.map((item, index) => {
        const product = products.find(product =>
            String(product.id) === String(item.productId)
        );

        if (!product) return "";

        const quantity = Math.max(
            1,
            Number(item.quantity) || 1
        );

        const price = Number(product.price) || 0;
        const stock = Math.max(0, Number(product.stock) || 0);
        const itemTotal = price * quantity;

        subtotal += itemTotal;

        // Support both relative paths and full image URLs.
        const imagePath = product.image || "";
        const imageURL = /^https?:\/\//i.test(imagePath)
            ? imagePath
            : imagePath
                ? `/${imagePath.replace(/^\.?\//, "")}`
                : "";

        return `
            <article class="cart-item">
                <img
                    src="${escapeHTML(imageURL)}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.style.visibility='hidden'"
                >

                <div class="cart-item-info">
                    <h3 class="cart-item-name">
                        ${escapeHTML(product.name)}
                    </h3>

                    <div class="cart-item-price">
                        Rs ${price.toFixed(2)}
                    </div>

                    <div class="quantity-controls">
                        <button
                            type="button"
                            aria-label="Decrease quantity"
                            onclick="decreaseQuantity(${index})"
                            ${quantity <= 1 ? "disabled" : ""}
                        >−</button>

                        <span>${quantity}</span>

                        <button
                            type="button"
                            aria-label="Increase quantity"
                            onclick="increaseQuantity(${index})"
                            ${quantity >= stock ? "disabled" : ""}
                        >+</button>
                    </div>

                    <p class="cart-line-total">
                        Item total: Rs ${itemTotal.toFixed(2)}
                    </p>

                    <button
                        type="button"
                        class="remove-btn"
                        onclick="removeItem(${index})"
                    >
                        Remove
                    </button>
                </div>
            </article>
        `;
    }).join("");

    container.innerHTML = `
        <div class="cart-container">
            <section class="cart-items">
                ${itemsHTML}
            </section>

            <aside class="cart-summary">
                <h2>Order Summary</h2>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>Rs ${subtotal.toFixed(2)}</span>
                </div>

                <div class="summary-row">
                    <span>Delivery</span>
                    <span>Free</span>
                </div>

                <div class="summary-row total-row">
                    <span>Total</span>
                    <span>Rs ${subtotal.toFixed(2)}</span>
                </div>

                <button
                    type="button"
                    class="checkout-btn"
                    onclick="checkout()"
                >
                    PROCEED TO CHECKOUT
                </button>

                <a
                    href="index.html"
                    class="continue-shopping"
                >
                    Continue Shopping
                </a>
            </aside>
        </div>
    `;
}

/* =========================================
   SAFE TEXT
========================================= */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

/* =========================================
   UPDATE QUANTITY
========================================= */

async function updateQuantity(index, change) {
    const cart = getCart();

    if (!cart[index]) return;

    try {
        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Could not verify product stock.");
        }

        const products = await response.json();

        const product = products.find(item =>
            String(item.id) === String(cart[index].productId)
        );

        if (!product) {
            alert("This product is no longer available.");
            await loadCart();
            return;
        }

        const stock = Math.max(0, Number(product.stock) || 0);
        const currentQuantity = Number(cart[index].quantity) || 1;
        const newQuantity = currentQuantity + change;

        if (newQuantity < 1) return;

        if (newQuantity > stock) {
            alert(`Only ${stock} item(s) available in stock.`);
            return;
        }

        cart[index].quantity = newQuantity;
        saveCart(cart);

        await loadCart();

    } catch (error) {
        console.error("Quantity update failed:", error);
        alert("Unable to update quantity. Please try again.");
    }
}

function increaseQuantity(index) {
    updateQuantity(index, 1);
}

function decreaseQuantity(index) {
    updateQuantity(index, -1);
}

/* =========================================
   REMOVE PRODUCT
========================================= */

function removeItem(index) {
    const cart = getCart();

    if (!cart[index]) return;

    cart.splice(index, 1);
    saveCart(cart);

    loadCart();
}

/* =========================================
   CHECKOUT PLACEHOLDER
========================================= */

function checkout() {
    alert("Checkout will be implemented in the next step.");
}
