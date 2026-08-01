// ==========================================
// 1. DEFAULT PRODUCTS & CONFIGURATION
// ==========================================
const initialProducts = [
    {
        id: "prod-1",
        name: "ROYAL OUD NOIR",
        category: "EAU DE PARFUM",
        price: 280.00,
        is_bestseller: true,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "prod-2",
        name: "IMPERIAL ROSE & AMBER",
        category: "EXTRAIT DE PARFUM",
        price: 320.00,
        is_bestseller: true,
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "prod-3",
        name: "SILVER MIST",
        category: "EAU DE TOILETTE",
        price: 150.00,
        is_bestseller: false,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: "prod-4",
        name: "GOLDEN SANDS",
        category: "EAU DE PARFUM",
        price: 270.00,
        is_bestseller: false,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
    }
];

let globalProducts = [];

// Payment Account Details
const PAYMENT_ACCOUNTS = {
    JazzCash: "JazzCash: 0340 0085347 (Title: Umar Bin Riaz)",
    EasyPaisa: "EasyPaisa: 0340 0085347 (Title: Umar Bin Riaz)",
    NayaPay: "NayaPay ID: 03400085347 / @umarbinriaz"
};

// ==========================================
// 2. LOCAL DATA & STORE RENDER
// ==========================================
function loadProductsFromStorage() {
    const stored = localStorage.getItem('umar_royale_products');
    if (!stored) {
        localStorage.setItem('umar_royale_products', JSON.stringify(initialProducts));
        globalProducts = initialProducts;
    } else {
        globalProducts = JSON.parse(stored);
    }
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const bestsellersContainer = document.getElementById('bestsellersContainer');

    // Store Collections Grid
    if (grid) {
        if (globalProducts.length === 0) {
            grid.innerHTML = '<div class="col-12 text-center py-5"><h4>No products available in store.</h4></div>';
        } else {
            grid.innerHTML = globalProducts.map(prod => `
                <div class="col-md-6 col-lg-3">
                    <div class="product-card glass-card text-center p-3 h-100 d-flex flex-column justify-content-between">
                        <div class="position-relative overflow-hidden mb-3">
                            <img src="${prod.image}" class="w-100 product-img" alt="${prod.name}" style="height:240px; object-fit:cover;">
                        </div>
                        <div>
                            <span class="text-muted small text-uppercase letter-spacing">${prod.category || 'PARFUM'}</span>
                            <h3 class="fs-5 mt-1">${prod.name}</h3>
                            <p class="gold-text fw-semibold fs-5 my-2">$${Number(prod.price).toFixed(2)}</p>
                        </div>
                        <button class="btn-editorial-primary w-100 mt-2" onclick="addToCart('${prod.id}')">ADD TO CART</button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Bestseller Section Mapping
    if (bestsellersContainer) {
        const bestsellers = globalProducts.filter(p => p.is_bestseller);
        if (bestsellers.length === 0) {
            bestsellersContainer.innerHTML = '<div class="col-12 text-center py-3"><p class="text-muted">No bestsellers selected.</p></div>';
        } else {
            bestsellersContainer.innerHTML = bestsellers.map(prod => `
                <div class="col-md-6 col-lg-4">
                    <div class="product-card glass-card text-center p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                            <img src="${prod.image}" class="w-100 mb-3" style="height:250px; object-fit:cover;" alt="${prod.name}">
                            <span class="badge bg-warning text-dark mb-2">★ BESTSELLER</span>
                            <h3 class="fs-4">${prod.name}</h3>
                            <p class="gold-text fw-semibold fs-5 my-2">$${Number(prod.price).toFixed(2)}</p>
                        </div>
                        <button class="btn-editorial-primary w-100 mt-2" onclick="addToCart('${prod.id}')">ADD TO CART</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// ==========================================
// 3. CART SYSTEM
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
// 4. CHECKOUT & PAYMENT METHOD TOGGLE
// ==========================================
window.togglePaymentDetails = function(method) {
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
};

// ==========================================
// 5. INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromStorage();
    updateCartUI();

    // Theme Switcher
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', nextTheme);
        const icon = document.getElementById('themeIcon');
        if (icon) icon.className = nextTheme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    });

    // Cart Drawer Toggle
    document.getElementById('cartToggleBtn')?.addEventListener('click', () => {
        document.getElementById('cartDrawer')?.classList.add('open');
    });
    document.getElementById('closeCartBtn')?.addEventListener('click', () => {
        document.getElementById('cartDrawer')?.classList.remove('open');
    });

    // Search Drawer Toggle
    document.getElementById('searchToggleBtn')?.addEventListener('click', () => {
        document.getElementById('searchOverlay')?.classList.add('open');
    });
    document.getElementById('closeSearchBtn')?.addEventListener('click', () => {
        document.getElementById('searchOverlay')?.classList.remove('open');
    });

    // Dynamic Payment Switch Listener
    document.getElementById('payMethod')?.addEventListener('change', function() {
        togglePaymentDetails(this.value);
    });

    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        const subtotal = document.getElementById('cartSubtotal')?.textContent || '$0.00';
        const modalSubtotal = document.getElementById('modalSubtotal');
        if (modalSubtotal) modalSubtotal.textContent = subtotal;
    });

    // Contact Form
    document.getElementById('contactForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for contacting UMAR ROYALE. We will get back to you shortly!');
        this.reset();
    });

    // Checkout Form (WhatsApp Integration + Local Storage Backup)
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

        // Save order locally for Admin CMS
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
            waMessage += `*TRX ID:* ${trxId}%0A%0A⚠️ *Note:* Payment screenshot attach kar dein.`;
        } else {
            waMessage += `📦 *Payment Mode:* Cash on Delivery`;
        }

        // Reset Cart State
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

        // Redirect to WhatsApp Number
        const whatsappNumber = "923400085347";
        window.open(`https://wa.me/${whatsappNumber}?text=${waMessage}`, '_blank');
    });
});