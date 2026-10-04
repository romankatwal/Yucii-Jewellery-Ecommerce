document.addEventListener("DOMContentLoaded", () => {

    loadCart();

});


function loadCart() {

    const cartContent =
        document.getElementById("cart-content");


    let cart =
        JSON.parse(
            localStorage.getItem("yuciiCart")
        ) || [];


    /*
    =====================================
    EMPTY CART
    =====================================
    */

    if (cart.length === 0) {

        cartContent.innerHTML = `

            <div class="empty-cart">

                <p>Your cart is empty 🛒</p>

                <a
                    href="index.html"
                    class="continue-shopping"
                >
                    Continue Shopping
                </a>

            </div>

        `;

        return;

    }


    /*
    =====================================
    GET PRODUCT DATA
    =====================================
    */

    fetch("/api/products")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to load products"
                );
            }

            return response.json();

        })

        .then(products => {

            let subtotal = 0;


            let itemsHTML = "";


            cart.forEach((cartItem, index) => {

                const product =
                    products.find(
                        p =>
                            String(p.id) ===
                            String(cartItem.productId)
                    );


                if (!product) {
                    return;
                }


                const itemTotal =
                    Number(product.price) *
                    Number(cartItem.quantity);


                subtotal += itemTotal;


                const imageName =
                    product.image
                        .split("/")
                        .pop();


                itemsHTML += `

                    <div class="cart-item">

                        <img
                            src="./assets/images/products/${imageName}"
                            alt="${product.name}"
                        >


                        <div class="cart-item-info">

                            <h3 class="cart-item-name">
                                ${product.name}
                            </h3>


                            <div class="cart-item-price">
                                Rs ${Number(product.price).toFixed(2)}
                            </div>


                            <div class="quantity-controls">

                                <button
                                    onclick="decreaseQuantity(${index})"
                                >
                                    −
                                </button>


                                <span>
                                    ${cartItem.quantity}
                                </span>


                                <button
                                    onclick="increaseQuantity(${index})"
                                >
                                    +
                                </button>

                            </div>


                            <button
                                class="remove-btn"
                                onclick="removeItem(${index})"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                `;

            });


            const total =
                subtotal;


            cartContent.innerHTML = `

                <div class="cart-container">


                    <div class="cart-items">

                        ${itemsHTML}

                    </div>


                    <div class="cart-summary">

                        <h2>
                            Order Summary
                        </h2>


                        <div class="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                Rs ${subtotal.toFixed(2)}
                            </span>

                        </div>


                        <div class="summary-row">

                            <span>
                                Delivery
                            </span>

                            <span>
                                Free
                            </span>

                        </div>


                        <div class="summary-row total-row">

                            <span>
                                Total
                            </span>

                            <span>
                                Rs ${total.toFixed(2)}
                            </span>

                        </div>


                        <button
                            class="checkout-btn"
                            onclick="checkout()"
                        >
                            PROCEED TO CHECKOUT
                        </button>

                    </div>

                </div>

            `;

        })

        .catch(error => {

            console.error(
                "Cart error:",
                error
            );

        });

}


/*
=====================================
INCREASE QUANTITY
=====================================
*/

function increaseQuantity(index) {

    let cart =
        JSON.parse(
            localStorage.getItem("yuciiCart")
        ) || [];


    cart[index].quantity++;


    localStorage.setItem(
        "yuciiCart",
        JSON.stringify(cart)
    );


    loadCart();

}


/*
=====================================
DECREASE QUANTITY
=====================================
*/

function decreaseQuantity(index) {

    let cart =
        JSON.parse(
            localStorage.getItem("yuciiCart")
        ) || [];


    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    }


    localStorage.setItem(
        "yuciiCart",
        JSON.stringify(cart)
    );


    loadCart();

}


/*
=====================================
REMOVE ITEM
=====================================
*/

function removeItem(index) {

    let cart =
        JSON.parse(
            localStorage.getItem("yuciiCart")
        ) || [];


    cart.splice(index, 1);


    localStorage.setItem(
        "yuciiCart",
        JSON.stringify(cart)
    );


    loadCart();

}


/*
=====================================
CHECKOUT
=====================================
*/

function checkout() {

    alert(
        "Checkout will be added next 🔥"
    );

}