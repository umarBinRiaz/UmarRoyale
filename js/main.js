// ==========================================
// 1. FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================
// ⚠️ Firebase Console se milli hui keys se replace karein
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "1234567890",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase App
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Global array for Products
let globalProducts = [];

// Account Details Config (WhatsApp / Online Payments)
const PAYMENT_ACCOUNTS = {
    JazzCash: "JazzCash: 0340 0085347 (Title: Umar Bin Riaz)",
    EasyPaisa: "EasyPaisa: 0340 0085347 (Title: Umar Bin Riaz)",
    NayaPay: "NayaPay ID: 03400085347 / @umarbinriaz"
};

// ==========================================
// 2. REALTIME PRODUCTS FETCH (CLOUD DATABASE)
// ==========================================
function listenForProductsFromCloud() {
    // Realtime listener — database me jab bhi update hoga, har device par instantly change hoga
    db.ref('products').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Firebase object ko Array me map kar rahe hain
            globalProducts = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
        } else {
            globalProducts = [];
        }
        renderProducts();
    });
}

// Store Grid HTML Rendering
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    if (globalProducts.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><h4>No products available in store.</h4></div>';
        return;
    }

    grid.innerHTML = globalProducts.map(prod => `
        <div class="col-md-6 col-lg-4">
            <div class="product-card glass-card">
                <div class="position-relative overflow-hidden mb-3">
                    <img src="${prod.image}" class="w-100 product-img" alt="${prod.name}" style="height:280px; object-fit:cover;">
                    <button class="wishlist-btn position-absolute top-0 end-0 m-3 border-0 bg-transparent">
                        <i class="fa-regular fa-heart fs-5"></i>
                    </button>
                </div>
                <div class="text-center">
                    <span class="text-muted small text-uppercase letter-spacing">${prod.category || 'PARFUM'}</span>
                    <h3 class="fs-4 mt-1">${prod.name}</h3>
                    <p class="gold-text fw-semibold fs-5 my-2">$${Number(prod.price).toFixed(2)}</p>
                    <button class="btn-editorial-primary w-100 mt-2" onclick="addToCart('${prod.id}')">ADD TO CART</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================
// 3. CART FUNCTIONS
// ==========================================
function getCart() {
    return JSON.parse(localStorage.getItem('umar_royale_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('umar_royale_cart', JSON.stringify(cart));
    updateCartUI();
}

window.addToCart = function (productId) {
    const product = globalProducts.find(p => p.id === productId);
    if (!product) return;

    let cart = getCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
    document.getElementById('cartDrawer')?.classList.add('open');
};

window.removeFromCart = function (productId) {
    let cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
};

function updateCartUI() {
    const cart = getCart();
    const cartCountBadge = document.getElementById('cartCount');
    const cartContainer = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotal');

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartCountBadge) cartCountBadge.textContent = totalQty;

    if (cartContainer) {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-center text-muted py-4">Your shopping bag is currently empty.</p>';
        } else {
            cartContainer.innerHTML = cart.map(item => `
                <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-subtle">
                    <img src="${item.image}" width="50" height="50" style="object-fit:cover; border-radius:4px;">
                    <div class="flex-grow-1 ms-3 text-start">
                        <h6 class="mb-0 fs-6">${item.name}</h6>
                        <small class="text-muted">Qty: ${item.qty} × $${item.price}</small>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold gold-text">$${(item.price * item.qty).toFixed(2)}</div>
                        <button class="btn btn-sm text-danger p-0 border-0" onclick="removeFromCart('${item.id}')">&times; Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }

    if (subtotalEl) {
        const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        subtotalEl.textContent = `$${totalAmount.toFixed(2)}`;
    }
}

// ==========================================
// 4. PAYMENT & CHECKOUT FUNCTIONS
// ==========================================
function togglePaymentDetails(method) {
    const infoBox = document.getElementById('onlinePayInfo');
    const detailsDiv = document.getElementById('payAccountDetails');
    const trxInput = document.getElementById('trxId');

    if (!infoBox) return;

    if (method === 'COD') {
        infoBox.classList.add('d-none');
        if (trxInput) trxInput.removeAttribute('required');
    } else {
        infoBox.classList.remove('d-none');
        if (detailsDiv) detailsDiv.innerHTML = `<i class="fa-solid fa-building-columns me-1"></i> ${PAYMENT_ACCOUNTS[method] || ''}`;
        if (trxInput) trxInput.setAttribute('required', 'true');
    }
}

// ==========================================
// 5. DOM CONTENT LOADED (EVENT LISTENERS)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Live products sync start karein
    listenForProductsFromCloud();
    updateCartUI();

    // Theme Toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', nextTheme);
        const icon = document.getElementById('themeIcon');
        if (icon) icon.className = nextTheme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    });

    // Drawers & Search Modals
    document.getElementById('cartToggleBtn')?.addEventListener('click', () => {
        document.getElementById('cartDrawer')?.classList.add('open');
    });
    document.getElementById('closeCartBtn')?.addEventListener('click', () => {
        document.getElementById('cartDrawer')?.classList.remove('open');
    });

    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        const subtotal = document.getElementById('cartSubtotal')?.textContent || '$0.00';
        const modalSubtotal = document.getElementById('modalSubtotal');
        if (modalSubtotal) modalSubtotal.textContent = subtotal;
    });

    // Unified Checkout Submit (Cloud CMS Backup + WhatsApp Redirection)
    document.getElementById('checkoutForm')?.addEventListener('submit', function (e) {
        e.preventDefault();

        const cart = getCart();
        if (cart.length === 0) {
            alert("Aapka cart khali hai!");
            return;
        }

        const name = document.getElementById('custName')?.value || '';
        const address = document.getElementById('custAddress')?.value || '';
        const phone = document.getElementById('custPhone')?.value || '';
        const method = document.getElementById('payMethod')?.value || 'COD';
        const trxId = document.getElementById('trxId')?.value || 'N/A';
        const totalAmount = document.getElementById('modalSubtotal')?.textContent || '$0.00';
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

        // Save order locally for CMS
        const newOrder = {
            orderId, date: new Date().toLocaleString(),
            customer: { name, address, phone },
            payment: { method, trxId },
            items: cart, total: totalAmount, status: 'Pending'
        };

        let orders = JSON.parse(localStorage.getItem('umar_royale_orders')) || [];
        orders.unshift(newOrder);
        localStorage.setItem('umar_royale_orders', JSON.stringify(orders));

        // WhatsApp Message Construction
        let itemsText = cart.map(item => `• ${item.name} (x${item.qty})`).join('%0A');
        let waMessage = `*NEW ORDER CONFIRMATION* 🛍️%0A%0A` +
            `*Order ID:* ${orderId}%0A` +
            `*Name:* ${name}%0A` +
            `*Phone:* ${phone}%0A` +
            `*Address:* ${address}%0A%0A` +
            `*Items Ordered:*%0A${itemsText}%0A%0A` +
            `*Total Amount:* ${totalAmount}%0A` +
            `*Payment Method:* ${method}%0A`;

        if (method !== 'COD') {
            waMessage += `*TRX ID:* ${trxId}%0A%0A⚠️ *Note:* Payment screenshot niche attach kar raha/rahi hoon.`;
        } else {
            waMessage += `📦 *Payment Mode:* Cash on Delivery`;
        }

        // Reset
        localStorage.removeItem('umar_royale_cart');
        updateCartUI();
        this.reset();
        togglePaymentDetails('COD');

        const modalEl = document.getElementById('checkoutModal');
        if (modalEl && window.bootstrap) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
        document.getElementById('cartDrawer')?.classList.remove('open');

        // Redirect to WhatsApp
        window.open(`https://wa.me/923092230740?text=${waMessage}`, '_blank');
    });
});