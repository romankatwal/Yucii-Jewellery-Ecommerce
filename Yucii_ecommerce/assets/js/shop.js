
"use strict";

const API_URL = "/api/products";

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const sortFilter = document.getElementById("sortFilter");
const stockFilter = document.getElementById("stockFilter");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("emptyState");
const shopError = document.getElementById("shopError");

let allProducts = [];

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

    const path = String(image).trim().replace(/\\/g, "/");

    if (/^(https?:\/\/|data:image\/)/i.test(path)) {
        return path;
    }

    const cleanPath = path.replace(/^\.\/+/, "");

    if (cleanPath.startsWith("/")) return cleanPath;

    if (cleanPath.startsWith("assets/")) {
        return "/" + cleanPath;
    }

    return "/assets/images/products/" + cleanPath;
}

function formatPrice(price) {
    return "Rs " + (Number(price) || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

async function loadProducts() {
    grid.innerHTML = "<p>Loading jewellery...</p>";
    shopError.hidden = true;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Products API returned " + response.status);
        }

        const products = await response.json();

        if (!Array.isArray(products)) {
            throw new Error("Invalid products response.");
        }

        allProducts = products;

        populateCategories();

        const params = new URLSearchParams(window.location.search);
        searchInput.value = params.get("q") || "";

        applyFilters();
    } catch (error) {
        console.error("Shop loading error:", error);
        grid.innerHTML = "";
        resultCount.textContent = "Products unavailable";
        shopError.hidden = false;
    }
}

function populateCategories() {
    const categories = [...new Set(
        allProducts
            .map(product => String(product.category || "").trim())
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    categoryFilter.innerHTML =
        '<option value="">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const min = minPrice.value.trim() === ""
        ? null : Number(minPrice.value);
    const max = maxPrice.value.trim() === ""
        ? null : Number(maxPrice.value);

    if ((min !== null && (!Number.isFinite(min) || min < 0)) ||
        (max !== null && (!Number.isFinite(max) || max < 0)) ||
        (min !== null && max !== null && min > max)) {
        resultCount.textContent = "Please check your price range.";
        return;
    }

    let filtered = allProducts.filter(product => {
        const name = String(product.name || "").toLowerCase();
        const description = String(product.description || "").toLowerCase();
        const productCategory = String(product.category || "");
        const price = Number(product.price) || 0;
        const stock = Number(product.stock) || 0;

        const matchesSearch =
            name.includes(query) || description.includes(query) ||
            productCategory.toLowerCase().includes(query);

        const matchesCategory =
            !category || productCategory === category;

        const matchesMin = min === null || price >= min;
        const matchesMax = max === null || price <= max;
        const matchesStock = !stockFilter.checked || stock > 0;

        return matchesSearch && matchesCategory &&
            matchesMin && matchesMax && matchesStock;
    });

    switch (sortFilter.value) {
        case "price-low":
            filtered.sort((a, b) => Number(a.price) - Number(b.price));
            break;
        case "price-high":
            filtered.sort((a, b) => Number(b.price) - Number(a.price));
            break;
        case "name":
            filtered.sort((a, b) =>
                String(a.name || "").localeCompare(String(b.name || ""))
            );
            break;
    }

    renderProducts(filtered);
}

function renderProducts(products) {
    grid.innerHTML = "";
    resultCount.textContent = `${products.length} product(s) found`;
    emptyState.hidden = products.length !== 0;

    products.forEach(product => {
        const id = encodeURIComponent(String(product.id));
        const name = escapeHTML(product.name || "Jewellery");
        const category = escapeHTML(product.category || "Collection");
        const image = escapeHTML(getImageURL(product.image));
        const price = formatPrice(product.price);
        const inStock = Number(product.stock) > 0;

        const card = document.createElement("article");
        card.className = "shop-card";

        card.innerHTML = `
            <a class="shop-card-image" href="./product.html?id=${id}">
                <img src="${image}" alt="${name}" loading="lazy">
            </a>

            <div class="shop-card-info">
                <div class="shop-card-category">${category}</div>

                <h3 class="shop-card-name">
                    <a href="./product.html?id=${id}">${name}</a>
                </h3>

                <div class="shop-card-price">${price}</div>

                <div class="shop-stock ${inStock ? "" : "out"}">
                    ${inStock ? "In stock" : "Out of stock"}
                </div>

                <a class="shop-view-button"
                    href="./product.html?id=${id}">
                    VIEW PRODUCT
                </a>
            </div>
        `;

        const imageElement = card.querySelector("img");
        imageElement.addEventListener("error", () => {
            imageElement.alt = "Product image unavailable";
            imageElement.removeAttribute("src");
        }, { once: true });

        grid.appendChild(card);
    });
}

function resetFilters() {
    searchInput.value = "";
    categoryFilter.value = "";
    minPrice.value = "";
    maxPrice.value = "";
    sortFilter.value = "featured";
    stockFilter.checked = false;

    applyFilters();
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
minPrice.addEventListener("input", applyFilters);
maxPrice.addEventListener("input", applyFilters);
sortFilter.addEventListener("change", applyFilters);
stockFilter.addEventListener("change", applyFilters);

document.getElementById("resetFilters")
    .addEventListener("click", resetFilters);

document.getElementById("emptyReset")
    .addEventListener("click", resetFilters);

document.getElementById("retryButton")
    .addEventListener("click", loadProducts);

loadProducts();
