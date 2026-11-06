// PRODUCT DATABASE (DEMO)

const products = [
    {
        id: 1,
        name: "Chocolate Cake",
        category: "Cakes",
        price: 12000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        description: "Delicious chocolate celebration cake."
    },
    {
        id: 2,
        name: "Vanilla Cake",
        category: "Cakes",
        price: 10000,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500",
        description: "Soft and creamy vanilla cake."
    },
    {
        id: 3,
        name: "Fresh Bread",
        category: "Bread",
        price: 3000,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
        description: "Freshly baked soft bread."
    },
    {
        id: 4,
        name: "Croissant",
        category: "Pastries",
        price: 2000,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500",
        description: "Golden and crispy croissant."
    },
    {
        id: 5,
        name: "Cookies",
        category: "Cookies",
        price: 1500,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500",
        description: "Fresh chocolate chip cookies."
    },
    {
        id: 6,
        name: "Strawberry Cake",
        category: "Cakes",
        price: 15000,
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500",
        description: "Sweet strawberry cream cake."
    }
];


// LOCAL STORAGE

let cart = JSON.parse(localStorage.getItem("bakeryCart")) || [];

function saveCart() {
    localStorage.setItem("bakeryCart", JSON.stringify(cart));
}


// DISPLAY PRODUCTS

function displayProducts(list = products) {

    const container = document.getElementById("productContainer");

    if (!container) return;

    container.innerHTML = "";

    list.forEach(product => {

        container.innerHTML += `
            <div class="product-card">

                <img src="${product.image}" alt="${product.name}">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <h4>₦${product.price.toLocaleString()}</h4>

                    <button class="btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

    });
}


// ADD TO CART

function addToCart(id) {

    const product = products.find(p => p.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart();

    updateCartCount();

    alert("Product added to cart!");
}


// CART COUNT

function updateCartCount() {

    const count = document.getElementById("cartCount");

    if (!count) return;

    const total = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    count.textContent = total;
}


// DISPLAY CART

function displayCart() {

    const container = document.getElementById("cartItems");

    const totalElement = document.getElementById("cartTotal");

    if (!container || !totalElement) return;

    container.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const subtotal = product.price * item.quantity;

        total += subtotal;

        container.innerHTML += `
            <div class="cart-item">

                <div>
                    <h3>${product.name}</h3>

                    <p>₦${product.price.toLocaleString()}</p>

                    <p>Quantity: ${item.quantity}</p>
                </div>

                <div>
                    <strong>₦${subtotal.toLocaleString()}</strong>

                    <br><br>

                    <button onclick="changeQuantity(${item.id}, -1)">
                        -
                    </button>

                    <button onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                    <button onclick="removeFromCart(${item.id})">
                        Remove
                    </button>
                </div>

            </div>
        `;

    });

    totalElement.textContent = "₦" + total.toLocaleString();

}


// CHANGE QUANTITY

function changeQuantity(id, amount) {

    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    saveCart();

    displayCart();

    updateCartCount();
}


// REMOVE PRODUCT

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveCart();

    displayCart();

    updateCartCount();

}


// SEARCH PRODUCTS

function searchProducts() {

    const search = document.getElementById("searchInput").value.toLowerCase();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(search)
    );

    displayProducts(filtered);
}


// FILTER CATEGORY

function filterCategory() {

    const category = document.getElementById("categoryFilter").value;

    if (category === "All") {
        displayProducts();
        return;
    }

    const filtered = products.filter(
        product => product.category === category
    );

    displayProducts(filtered);
}


// CHECKOUT

function checkout(event) {

    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const email = document.getElementById("customerEmail").value;
    const address = document.getElementById("customerAddress").value;
    const date = document.getElementById("deliveryDate").value;

    const order = {
        orderNumber: "BK" + Date.now(),
        customer: name,
        phone: phone,
        email: email,
        address: address,
        deliveryDate: date,
        items: cart,
        orderDate: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem("bakeryOrders")) || [];

    orders.push(order);

    localStorage.setItem("bakeryOrders", JSON.stringify(orders));

    cart = [];

    saveCart();

    alert(
        "Your order has been placed successfully!\n" +
        "Order Number: " + order.orderNumber
    );

    window.location.href = "index.html";

}


// CONNECT EVENTS

document.addEventListener("DOMContentLoaded", function() {

    displayProducts();

    displayCart();

    updateCartCount();

    const search = document.getElementById("searchInput");

    if (search) {
        search.addEventListener("input", searchProducts);
    }

    const category = document.getElementById("categoryFilter");

    if (category) {
        category.addEventListener("change", filterCategory);
    }

    const form = document.getElementById("checkoutForm");

    if (form) {
        form.addEventListener("submit", checkout);
    }

});