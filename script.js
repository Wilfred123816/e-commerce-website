// Shopping Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = 0;
let totalPrice = 0;
// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartCountElement = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const totalPriceElement = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
// Product Elements
const mainImage = document.getElementById('mainImage');
const thumbnails = document.querySelectorAll('.thumbnail');
const colorOptions = document.querySelectorAll('.color');
const quantityMinus = document.getElementById('quantityMinus');
const quantityPlus = document.getElementById('quantityPlus');
const quantityInput = document.getElementById('quantityInput');
const addToCartBtn = document.getElementById('addToCartBtn');
const buyNowBtn = document.querySelector('.buy-now-btn');
const wishlistBtn = document.querySelector('.wishlist-btn');
const quickAddBtns = document.querySelectorAll('.quick-add-btn');
const cardAddBtns = document.querySelectorAll('.card-add-btn');

// Product Data
const product = {
    id: 1,
    name: 'Nexus Pro X100',
    price: 199.99,
    color: 'black',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
};

// Initialize Cart
function initCart() {
    updateCartCount();
    updateCartUI();
}

// Update Cart Count
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Calculate Total Price
function calculateTotal() {
    totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Update Cart UI
function updateCartUI() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="decrease-quantity" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-index="${index}">+</button>
                        </div>
                        <button class="remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to dynamic buttons
        document.querySelectorAll('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                updateQuantity(index, -1);
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                updateQuantity(index, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.remove-item').dataset.index);
                removeFromCart(index);
            });
        });
    }
    
    calculateTotal();
}

// Add to Cart
function addToCart(product, quantity, color) {
    const existingItemIndex = cart.findIndex(item => 
        item.id === product.id && item.color === color
    );
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            ...product,
            color: color,
            quantity: quantity
        });
    }
    
    updateCartCount();
    updateCartUI();
    
    // Show success message
    showNotification('Item added to cart!', 'success');
}

// Update Quantity
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity < 1) {
            cart.splice(index, 1);
        }
        
        updateCartCount();
        updateCartUI();
    }
}

// Remove from Cart
function removeFromCart(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        updateCartCount();
        updateCartUI();
        showNotification('Item removed from cart', 'info');
    }
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
}

// Image Gallery
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        thumbnail.classList.add('active');
        
        // Update main image
        const newImage = thumbnail.dataset.image;
        mainImage.src = newImage;
        product.image = newImage;
    });
});

// Color Selection
colorOptions.forEach(color => {
    color.addEventListener('click', () => {
        // Remove active class from all colors
        colorOptions.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked color
        color.classList.add('active');
        
        // Update product color
        product.color = color.dataset.color;
    });
});

// Quantity Controls
quantityMinus.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);
    if (value > 1) {
        quantityInput.value = value - 1;
    }
});

quantityPlus.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);
    if (value < 10) {
        quantityInput.value = value + 1;
    }
});

quantityInput.addEventListener('change', () => {
    let value = parseInt(quantityInput.value);
    if (value < 1) quantityInput.value = 1;
    if (value > 10) quantityInput.value = 10;
});

// Add to Cart Button
addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    addToCart(product, quantity, product.color);
});

// Buy Now Button
buyNowBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    addToCart(product, quantity, product.color);
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

// Wishlist Button
wishlistBtn.addEventListener('click', () => {
    wishlistBtn.innerHTML = wishlistBtn.innerHTML.includes('fas') 
        ? '<i class="far fa-heart"></i>' 
        : '<i class="fas fa-heart"></i>';
    showNotification('Added to wishlist', 'success');
});

// Quick Add Buttons (for related products)
quickAddBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('.current').textContent.replace('$', ''));
        
        const quickProduct = {
            id: Date.now(),
            name: productName,
            price: productPrice,
            color: 'default',
            image: productCard.querySelector('img').src
        };
        
        addToCart(quickProduct, 1, 'default');
    });
});

// Card Add Buttons
cardAddBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('.current').textContent.replace('$', ''));
        
        const cardProduct = {
            id: Date.now(),
            name: productName,
            price: productPrice,
            color: 'default',
            image: productCard.querySelector('img').src
        };
        
        addToCart(cardProduct, 1, 'default');
    });
});

// Cart Toggle
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Checkout Button
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    showNotification('Proceeding to checkout...', 'success');
    setTimeout(() => {
        alert(`Order Summary:\nTotal Items: ${cartCount}\nTotal Price: $${totalPrice.toFixed(2)}\n\nThank you for your order!`);
        cart = [];
        updateCartCount();
        updateCartUI();
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }, 1000);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            z-index: 10000;
            transform: translateX(0);
            transition: transform 0.3s ease;
        }
        
        .notification.hide {
            transform: translateX(120%);
        }
        
        .notification.success {
            border-left: 4px solid #4CAF50;
        }
        
        .notification.error {
            border-left: 4px solid #f44336;
        }
        
        .notification.info {
            border-left: 4px solid #2196F3;
        }
        
        .close-notification {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #777;
            margin-left: 15px;
        }
    `;
    document.head.appendChild(style);
});