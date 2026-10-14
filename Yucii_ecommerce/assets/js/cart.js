
"use strict";

document.addEventListener("DOMContentLoaded", loadCart);

const CART_KEY = "yuciiCart";
const API_URL = "/api/products";

function getCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

        if (!Array.isArray(cart)) return [];

        return cart
            .filter(item =>
                item &&
                item.productId != null &&
                Number(item.quantity) > 0
            )
            .map(item => ({
                ...item,
                quantity: Math.floor(Number(item.quantity))
            }));
    } catch (error) {
        console.error("Unable to read cart:", error);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getImageURL(image) {
    if (!image) return "";

    const path = String(image).trim();

    if (/^(https?:\/\/|data:image\/)/i.test(path)) {
        return path;
    }

    return "/" + path.replace(/^\/+/, "");
}

function formatPrice(price) {
    return "Rs " + Number(price).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

async function loadCart() {
    const container = document.getElementById("cart-content");

    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        showEmptyCart(container);
        return;
    }

    container.innerHTML = "<p>Loading your cart...</p>";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Products API returned " + response.status);
        }

        const products = await response.json();

        if (!Array.isArray(products)) {
            throw new Error("Invalid products response.");
        }

        // Remove entries whose products no longer exist.
        const validCart = cart.filter(item =>
            products.some(product =>
                String(product.id) === String(item.productId)
            )
        );

        if (validCart.length !== cart.length) {
            saveCart(validCart);
        }

        if (validCart.length === 0) {
            showEmptyCart(container);
            return;
        }

        renderCart(container, validCart, products);

    } catch (error) {
        console.error("Cart loading error:", error);

        container.innerHTML = `
            <div class="cart-message">
                <p>Unable to load your products.</p>
                <p>Check that your backend is running, then try again.</p>
                <button type="button" class="continue-shopping"
                    onclick="loadCart()">Try Again</button>
            </div>
        `;
    }
}

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

function renderCart(container, cart, products) {
    let subtotal = 0;
    let itemCount = 0;

    const itemsHTML = cart.map((item, index) => {
        const product = products.find(product =>
            String(product.id) === String(item.productId)
        );

        if (!product) return "";

        const quantity = Math.max(1, Number(item.quantity) || 1);
        const price = Math.max(0, Number(product.price) || 0);
        const stock = Math.max(0, Number(product.stock) || 0);
        const itemTotal = price * quantity;

        subtotal += itemTotal;
        itemCount += quantity;

        const imageURL = getImageURL(product.image);

        return `
            <article class="cart-item">
                <img
                    src="${escapeHTML(imageURL)}"
                    alt="${escapeHTML(product.name || "Product")}"
                    onerror="this.style.visibility='hidden'"
                >

                <div class="cart-item-info">
                    <h3 class="cart-item-name">
                        ${escapeHTML(product.name || "Unnamed product")}
                    </h3>

                    <div class="cart-item-price">
                        ${formatPrice(price)} each
                    </div>

                    <div class="quantity-controls">
                        <button type="button"
                            aria-label="Decrease quantity"
                            onclick="decreaseQuantity(${index})"
                            ${quantity <= 1 ? "disabled" : ""}>−</button>

                        <span>${quantity}</span>

                        <button type="button"
                            aria-label="Increase quantity"
                            onclick="increaseQuantity(${index})"
                            ${quantity >= stock ? "disabled" : ""}>+</button>
                    </div>

                    <p class="cart-line-total">
                        Item total: ${formatPrice(itemTotal)}
                    </p>

                    <button type="button" class="remove-btn"
                        onclick="removeItem(${index})">
                        Remove item
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
                    <span>Items (${itemCount})</span>
                    <span>${itemCount}</span>
                </div>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>

                <div class="summary-row">
                    <span>Delivery</span>
                    <span>Free</span>
                </div>

                <div class="summary-row total-row">
                    <span>Total</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>

                <button type="button" class="checkout-btn"
                    onclick="checkout()">
                    PROCEED TO CHECKOUT
                </button>

                <a href="index.html" class="continue-shopping">
                    Continue Shopping
                </a>
            </aside>
        </div>
    `;
}

async function updateQuantity(index, change) {
    const cart = getCart();

    if (!cart[index]) return;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not verify stock.");
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

function removeItem(index) {
    const cart = getCart();

    if (!cart[index]) return;

    cart.splice(index, 1);
    saveCart(cart);

    loadCart();
}

function checkout() {
    alert("Checkout will be implemented in the next step.");
}
