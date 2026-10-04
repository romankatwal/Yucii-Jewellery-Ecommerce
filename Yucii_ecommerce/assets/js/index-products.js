document.addEventListener("DOMContentLoaded", () => {

    fetch("/api/products")

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load products");
            }

            return response.json();

        })

        .then(products => {

            console.log("Database products:", products);


            function normalize(text) {

                return (text || "")
                    .toLowerCase()
                    .replace(/\s+/g, " ")
                    .trim();

            }


            const cards =
                document.querySelectorAll(".showcase");


            console.log(
                "Total showcase cards:",
                cards.length
            );


            cards.forEach(card => {

                const titleElement =
                    card.querySelector(".showcase-title");


                if (!titleElement) {
                    return;
                }


                const title =
                    normalize(titleElement.textContent);


                /*
                ======================================
                GET IMAGE
                ======================================
                */

                const imageElement =
                    card.querySelector(
                        ".showcase-img, .product-img.default"
                    );


                let imageName = "";


                if (imageElement) {

                    const imageSrc =
                        imageElement.getAttribute("src") || "";


                    imageName =
                        imageSrc
                            .split("/")
                            .pop()
                            .toLowerCase();

                }


                /*
                ======================================
                GET CURRENT PRICE
                ======================================
                */

                const priceElement =
                    card.querySelector(".price");


                let price = "";


                if (priceElement) {

                    price =
                        priceElement.textContent
                            .replace(/[^\d.]/g, "");

                }


                /*
                ======================================
                1. MATCH NAME FIRST
                ======================================
                */

                let product =
                    products.find(p => {

                        return (
                            normalize(p.name) ===
                            title
                        );

                    });


                /*
                ======================================
                2. IF NAME DOESN'T MATCH,
                   MATCH IMAGE
                ======================================
                */

                if (!product && imageName) {

                    product =
                        products.find(p => {

                            if (!p.image) {
                                return false;
                            }


                            const dbImageName =
                                p.image
                                    .split("/")
                                    .pop()
                                    .toLowerCase();


                            return (
                                dbImageName ===
                                imageName
                            );

                        });

                }


                /*
                ======================================
                PRODUCT NOT FOUND
                ======================================
                */

                if (!product) {

                    console.warn(
                        "❌ PRODUCT NOT FOUND:",
                        title,
                        imageName
                    );

                    return;

                }


                /*
                ======================================
                PRODUCT URL
                ======================================
                */

                const productURL =
                    `product.html?id=${product.id}`;


                /*
                ======================================
                IMAGE LINK
                ======================================
                */
const imageLink =
    card.querySelector(
        ".showcase-img-box, .showcase-banner"
    );

                if (imageLink) {

                    imageLink.href =
                        productURL;

                }


                /*
                ======================================
                TITLE LINK
                ======================================
                */

                const titleLink =
                    titleElement.closest("a");


                if (titleLink) {

                    titleLink.href =
                        productURL;

                }


                /*
                ======================================
                WHOLE CARD CLICK
                ======================================
                */

                card.style.cursor =
                    "pointer";


                card.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target.closest("a")
                        ) {
                            return;
                        }


                        if (
                            event.target.closest("button")
                        ) {
                            return;
                        }


                        window.location.href =
                            productURL;

                    }
                );


                console.log(
                    "✅ LINKED:",
                    product.name,
                    "→",
                    productURL
                );

            });

        })


        .catch(error => {

            console.error(
                "❌ Product linking error:",
                error
            );

        });

});

/* ======================================
   ADD TO CART BUTTON
====================================== */

let addCartButton =
    card.querySelector(".homepage-add-cart");


if (!addCartButton) {

    addCartButton =
        document.createElement("button");

    addCartButton.className =
        "homepage-add-cart";

    addCartButton.textContent =
        "ADD TO CART";


    card.appendChild(addCartButton);

}


/* ======================================
   ADD TO CART
====================================== */

let addCartButton = card.querySelector(".homepage-add-cart");

if (!addCartButton) {
    addCartButton = document.createElement("button");
    addCartButton.className = "homepage-add-cart";
    addCartButton.textContent = "ADD TO CART";
    card.appendChild(addCartButton);
}

addCartButton.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Get the current cart
    let cart = JSON.parse(localStorage.getItem("yuciiCart")) || [];

    // Check if THIS exact product is already in cart
    const existingItem = cart.find(
        item => String(item.productId) === String(product.id)
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: product.id,
            quantity: 1
        });
    }

    // Save updated cart
    localStorage.setItem("yuciiCart", JSON.stringify(cart));

    alert(`${product.name} added to cart!`);

    console.log("🛒 Added product:", {
        id: product.id,
        name: product.name,
        quantity: existingItem
            ? existingItem.quantity
            : 1
    });
};