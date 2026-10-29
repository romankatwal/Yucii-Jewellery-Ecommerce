# Yucii — Jewellery E-Commerce Web Application

Yucii is a jewellery e-commerce web application designed to provide customers with a simple and elegant online shopping experience. The project focuses on displaying jewellery products, retrieving product information from a MySQL database, and managing shopping cart operations.

The application is being developed using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.

## ✨ Features

### Implemented / Developed

- **Homepage:** Displays jewellery collections and product sections, including New Arrivals, Trending, and Top Rated.
- **Product Display:** Displays product information such as name, category, image, price, and description.
- **Product Details Page:** Provides a dedicated page for viewing an individual product.
- **MySQL Database Integration:** Stores product information in a MySQL database.
- **REST API:** Uses Express.js endpoints to retrieve product data.
- **Shopping Cart:** Supports adding products, changing quantities, and removing items.
- **Cart Summary:** Calculates item totals, subtotal, and order total.
- **Local Storage:** Uses browser local storage to retain cart items.
- **Responsive Styling:** Includes CSS styling for product pages and shopping cart layouts.

### In Progress

- Shop / product listing page with search and filters.
- Correct product-specific information loading on the product details page.
- Shop page debugging and integration testing.
- Checkout functionality.
- Customer orders and payment integration.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive layouts |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | Backend server and REST API |
| MySQL | Relational database |
| mysql2 | MySQL database connectivity |
| Local Storage | Shopping cart persistence |

## 📁 Project Structure

```text
yucii_Ecommerce/
├── Backend/
│   ├── node_modules/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── Yucii_ecommerce/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style-prefix.css
│   │   │   ├── style.css
│   │   │   ├── product.css
│   │   │   └── shop.css
│   │   │
│   │   ├── images/
│   │   │   └── products/
│   │   │
│   │   └── js/
│   │       ├── script.js
│   │       ├── index-products.js
│   │       ├── product.js
│   │       ├── cart.js
│   │       └── cart-count.js
│   │
│   ├── index.html
│   ├── product.html
│   ├── cart.html
│   └── shop.html
│
├── .gitignore
├── README.md
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml
└── nginx.conf
```

*Note: The shop page and its associated files are still being developed and debugged.*

## ⚙️ Prerequisites

Install the following before running the project:

- Node.js and npm
- MySQL Server
- MySQL Workbench (optional, for database management)
- Visual Studio Code or another code editor

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd yucii_Ecommerce
```

Replace the placeholder with your actual GitHub repository URL.

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

Ensure the required packages are listed in `package.json`, including Express.js, mysql2, and any other packages used by the application.

### 3. Configure the Database

Start your MySQL server and create the project database if it does not already exist.

```sql
CREATE DATABASE yucii_db;
USE yucii_db;
```

Create the required `products` table and insert product records according to the schema used by `server.js` and `db.js`.

The products table is expected to contain fields such as:

- `id`
- `name`
- `description`
- `price`
- `image`
- `category`
- `stock`
- `created_at`

Use your existing database schema when configuring the application.

### 4. Configure Database Credentials

Configure your MySQL connection in `Backend/db.js` or your environment configuration, depending on how the backend is currently set up.

Never commit database passwords, API secrets, or other private credentials to GitHub.

### 5. Start the Backend

From the `Backend` directory, run:

```bash
node server.js
```

The application has previously been configured to use port `5000`.

### 6. Open the Application

When the backend is running and serving the frontend files, open:

- Homepage: `http://localhost:5000/`
- Product page: `http://localhost:5000/product.html?id=1`
- Shopping cart: `http://localhost:5000/cart.html`
- Shop page: `http://localhost:5000/shop.html`
- Products API: `http://localhost:5000/api/products`

The shop page is currently under development and may not render correctly yet.

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api` | Check the backend status |
| GET | `/api/products` | Retrieve the product list |
| GET | `/api/products/:id` | Retrieve a product by its ID |

These endpoints describe the backend routes developed for the project. Verify their current behavior when running the application.

## 🛒 Shopping Cart

The shopping cart uses the browser's `localStorage` with the key:

```javascript
yuciiCart
```

Cart entries use a product ID and quantity to associate selected items with product records returned by the backend.

The cart page supports:

- Displaying cart items
- Increasing and decreasing quantities
- Removing products
- Calculating item totals
- Displaying the order summary

Checkout and payment processing have not yet been completed.

## 🔮 Future Improvements

- Complete product search and category filtering.
- Fix product-specific loading and shop page rendering issues.
- Add customer registration and login.
- Implement a complete checkout process.
- Integrate a payment gateway.
- Add order history and order tracking.
- Introduce customer reviews and ratings.
- Improve product recommendations and wishlist functionality.
- Complete deployment and production testing.

## 🎯 Project Objective

The objective of Yucii is to develop a functional jewellery e-commerce platform that combines an attractive frontend with a database-driven backend. The project also provides practical experience in frontend development, REST API integration, relational database management, and shopping cart functionality.

## 👨‍💻 Development Status

**Status:** Work in Progress

Yucii is under active development. Core frontend pages, backend API routes, database connectivity, and shopping cart functionality have been developed. Product listing integration, product-specific loading, checkout, and final testing remain ongoing tasks.




