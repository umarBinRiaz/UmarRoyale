// ==========================================
// UMAR ROYALE — Dynamic CMS & Cart Engine
// ==========================================

// Initial Default Products (Agar CMS me koi product na ho)
const defaultProducts = [
    {
        id: "prod-1",
        name: "ROYAL OUD NOIR",
        category: "EAU DE PARFUM",
        price: 280,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "prod-2",
        name: "IMPERIAL ROSE & AMBER",
        category: "EXTRAIT DE PARFUM",
        price: 320,
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "prod-3",
        name: "VELVET SAFFRON",
        category: "LIMITED EDITION",
        price: 410,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
    }
];

// Initialize Data in LocalStorage
function getProducts() {
    const stored = localStorage.getItem('umar_royale_products');
    if (!stored) {
        localStorage.setItem('umar_royale_products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return JSON.parse(stored);
}

function getCart() {
    return JSON.parse(localStorage.getItem('umar_royale_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('umar_royale_cart', JSON.stringify(cart));
    updateCartUI();
}

// 1. RENDER PRODUCTS DYNAMICALLY (CMS sync)
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const products = getProducts();
    grid.innerHTML = products.map(prod => `
        <div class="col-md-6 col-lg-4">
            <div class="product-card glass-card">
                <div class="position-relative overflow-hidden mb-3">
                    <img src="${prod.image}" class="w-100 product-img" alt="${prod.name}" style="height:280px; object-fit:cover;">
                    <button class="wishlist-btn position-absolute top-0 end-0 m-3">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="text-center">
                    <span class="text-muted small text-uppercase letter-spacing">${prod.category}</span>
                    <h3 class="fs-4 mt-1">${prod.name}</h3>
                    <p class="gold-text fw-semibold fs-5 my-2">$${parseFloat(prod.price).toFixed(2)}</p>
                    <button class="btn-editorial-primary w-100 mt-2" onclick="addToCart('${prod.id}')">ADD TO CART</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 2. ADD TO CART FUNCTIONALITY
window.addToCart = function (productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);

    // Open Cart Drawer Automatically
    const cartDrawer = document.getElementById('cartDrawer');
    if (cartDrawer) cartDrawer.classList.add('open');
};

// 3. REMOVE FROM CART
window.removeFromCart = function (productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
};

// 4. UPDATE CART UI
function updateCartUI() {
    const cart = getCart();
    const cartCountBadge = document.getElementById('cartCount');
    const cartItemsBody = document.querySelector('.cart-items-body');
    const subtotalEl = document.getElementById('cartSubtotal');

    // Update Badge Count
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountBadge) cartCountBadge.textContent = totalCount;

    // Update Cart Drawer Body
    if (cartItemsBody) {
        if (cart.length === 0) {
            cartItemsBody.innerHTML = '<p class="text-center text-muted py-4">Your shopping bag is currently empty.</p>';
        } else {
            cartItemsBody.innerHTML = cart.map(item => `
                <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                    <img src="${item.image}" width="50" height="50" style="object-fit:cover; border-radius:4px;">
                    <div class="flex-grow-1 ms-3 text-start">
                        <h6 class="mb-0 fs-6">${item.name}</h6>
                        <small class="text-muted">Qty: ${item.qty} × $${item.price}</small>
                    </div>
                    <div class="text-end">
                        <span class="d-block fw-bold">$${(item.price * item.qty).toFixed(2)}</span>
                        <button class="btn btn-sm text-danger p-0" onclick="removeFromCart('${item.id}')">&times;</button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Update Subtotal Price
    if (subtotalEl) {
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        subtotalEl.textContent = `$${totalAmount.toFixed(2)}`;
    }
}

// 5. CMS FUNCTION (Call this from admin.html form submit)
window.addNewProductFromCMS = function (name, category, price, image) {
    const products = getProducts();
    const newProduct = {
        id: 'prod-' + Date.now(),
        name: name,
        category: category || 'EAU DE PARFUM',
        price: parseFloat(price),
        image: image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80'
    };

    products.push(newProduct);
    localStorage.setItem('umar_royale_products', JSON.stringify(products));
    alert('Product added successfully!');
};

// INITIALIZE ON LOAD
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});
// LocalStorage Handlers
function getProducts() {
    const stored = localStorage.getItem('umar_royale_products');
    if (!stored) return [];
    return JSON.parse(stored);
}

function getCart() {
    return JSON.parse(localStorage.getItem('umar_royale_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('umar_royale_cart', JSON.stringify(cart));
    updateCartUI();
}

// Render Products on Main Page
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    const products = getProducts();

    if (products.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><h4>No products available in store right now.</h4></div>';
        return;
    }

    grid.innerHTML = products.map(prod => `
        <div class="col-md-6 col-lg-4">
            <div class="product-card glass-card">
                <div class="position-relative overflow-hidden mb-3">
                    <img src="${prod.image}" class="w-100 product-img" alt="${prod.name}" style="height:280px; object-fit:cover;">
                    <button class="wishlist-btn position-absolute top-0 end-0 m-3 border-0 bg-transparent">
                        <i class="fa-regular fa-heart fs-5"></i>
                    </button>
                </div>
                <div class="text-center">
                    <span class="text-muted small text-uppercase letter-spacing">${prod.category}</span>
                    <h3 class="fs-4 mt-1">${prod.name}</h3>
                    <p class="gold-text fw-semibold fs-5 my-2">$${Number(prod.price).toFixed(2)}</p>
                    <button class="btn-editorial-primary w-100 mt-2" onclick="addToCart('${prod.id}')">ADD TO CART</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add Item to Bag
window.addToCart = function (productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
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

// Remove Item from Bag
window.removeFromCart = function (productId) {
    let cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
};

// Update Cart Drawer UI & Counter Badge
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

// Events
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();

    // Theme Switcher
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    themeToggleBtn?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', nextTheme);
        themeIcon.className = nextTheme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    });

    // Cart Drawer Controls
    document.getElementById('cartToggleBtn')?.addEventListener('click', () => {
        document.getElementById('cartDrawer')?.classList.add('open');
    });
    document.getElementById('closeCartBtn')?.addEventListener('click', () => {
        document.getElementById('cartDrawer')?.classList.remove('open');
    });

    // Search Controls
    document.getElementById('searchToggleBtn')?.addEventListener('click', () => {
        document.getElementById('searchOverlay')?.classList.add('open');
    });
    document.getElementById('closeSearchBtn')?.addEventListener('click', () => {
        document.getElementById('searchOverlay')?.classList.remove('open');
    });
});
// Sync Subtotal with Modal & Handle Order Submission
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    const subtotal = document.getElementById('cartSubtotal')?.textContent || '$0.00';
    const modalSubtotal = document.getElementById('modalSubtotal');
    if (modalSubtotal) modalSubtotal.textContent = subtotal;
});

document.getElementById('checkoutForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear Cart from Storage after successful order
    localStorage.removeItem('umar_royale_cart');

    // Refresh Cart UI
    if (typeof updateCartUI === 'function') updateCartUI();

    // Hide Modal & Cart Drawer
    const modalEl = document.getElementById('checkoutModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    document.getElementById('cartDrawer')?.classList.remove('open');

    alert('Thank you! Your order has been placed successfully.');
});
// Sync Subtotal with Modal & Handle Order Submission
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    const subtotal = document.getElementById('cartSubtotal')?.textContent || '$0.00';
    const modalSubtotal = document.getElementById('modalSubtotal');
    if (modalSubtotal) modalSubtotal.textContent = subtotal;
});

document.getElementById('checkoutForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
        alert("Aapka cart khali hai!");
        return;
    }

    // Customer details collect karein
    const customerName = document.getElementById('custName').value;
    const customerAddress = document.getElementById('custAddress').value;
    const customerPhone = document.getElementById('custPhone').value;
    const totalAmount = document.getElementById('cartSubtotal').textContent;

    // Order Object Banayein
    const newOrder = {
        orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        customer: {
            name: customerName,
            address: customerAddress,
            phone: customerPhone
        },
        items: cart,
        total: totalAmount,
        status: 'Pending'
    };

    // Save Order to CMS LocalStorage
    let orders = JSON.parse(localStorage.getItem('umar_royale_orders')) || [];
    orders.unshift(newOrder); // Newest orders first
    localStorage.setItem('umar_royale_orders', JSON.stringify(orders));

    // Clear Cart
    localStorage.removeItem('umar_royale_cart');
    if (typeof updateCartUI === 'function') updateCartUI();

    // Close Modal
    const modalEl = document.getElementById('checkoutModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    document.getElementById('cartDrawer')?.classList.remove('open');

    this.reset();
    alert('Shukriya! Aapka order receive ho gaya hai aur CMS me save ho chuka hai.');
});
// Sync Subtotal with Modal
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    const subtotal = document.getElementById('cartSubtotal')?.textContent || '$0.00';
    const modalSubtotal = document.getElementById('modalSubtotal');
    if (modalSubtotal) modalSubtotal.textContent = subtotal;
});

// Save Order Functionality
document.getElementById('checkoutForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
        alert("Aapka cart khali hai!");
        return;
    }

    // Customer details collect karein
    const nameVal = document.getElementById('custName')?.value;
    const addressVal = document.getElementById('custAddress')?.value;
    const phoneVal = document.getElementById('custPhone')?.value;
    const totalVal = document.getElementById('cartSubtotal')?.textContent || '$0.00';

    // New Order Object
    const newOrder = {
        orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleString(),
        customer: {
            name: nameVal,
            address: addressVal,
            phone: phoneVal
        },
        items: cart,
        total: totalVal,
        status: 'Pending'
    };

    // 1. Storage se purane orders fetch karein
    let existingOrders = JSON.parse(localStorage.getItem('umar_royale_orders')) || [];

    // 2. Naya order top par add karein
    existingOrders.unshift(newOrder);

    // 3. Storage me save karein
    localStorage.setItem('umar_royale_orders', JSON.stringify(existingOrders));

    // 4. Cart khali karein
    localStorage.removeItem('umar_royale_cart');
    if (typeof updateCartUI === 'function') updateCartUI();

    // 5. Form Reset & Modals Close
    this.reset();

    const modalEl = document.getElementById('checkoutModal');
    if (modalEl && window.bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }

    document.getElementById('cartDrawer')?.classList.remove('open');

    alert('Order receive ho gaya hai aur CMS me save ho chuka hai!');
});