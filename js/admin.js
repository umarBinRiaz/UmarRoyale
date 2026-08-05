// DEFAULT ADMIN STATE INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupAdminNavigation();
    renderAdminProductsTable();
    loadCmsFormValues();
    setupAdminForms();
});

// AUTHENTICATION GUARD
function checkAuth() {
    const authenticated = sessionStorage.getItem('royale_admin_auth');
    if (authenticated === 'true') {
        document.getElementById('adminAuthOverlay').style.display = 'none';
        document.getElementById('adminApp').style.setProperty('display', 'flex', 'important');
    }
}

document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    if (user === 'admin' && pass === 'royale2026') {
        sessionStorage.setItem('royale_admin_auth', 'true');
        checkAuth();
    } else {
        alert('Invalid Royal Credentials');
    }
});

document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('royale_admin_auth');
    location.reload();
});

// TAB SWITCHING
function setupAdminNavigation() {
    const tabs = document.querySelectorAll('#adminNavTabs .nav-link');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.dataset.tab;
            document.querySelectorAll('.admin-tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(target).classList.add('active');
        });
    });
}

// RENDER PRODUCTS TABLE
function renderAdminProductsTable() {
    const products = JSON.parse(localStorage.getItem('royale_products')) || DEFAULT_PRODUCTS;
    const tbody = document.getElementById('adminProductsTbody');
    if (!tbody) return;

    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image}" width="45" height="45" class="rounded object-fit-cover"></td>
            <td class="fw-semibold">${p.title}</td>
            <td><span class="badge bg-gold text-dark">${p.category}</span></td>
            <td>Rs. ${Number(p.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');

    document.getElementById('statProductsCount').innerText = `${products.length} Items`;
}

// DELETE PRODUCT ENGINE
window.deleteProduct = function (id) {
    let products = JSON.parse(localStorage.getItem('royale_products')) || DEFAULT_PRODUCTS;
    products = products.filter(p => p.id !== id);
    localStorage.setItem('royale_products', JSON.stringify(products));
    renderAdminProductsTable();
};

// FORM HANDLING & HOMEPAGE UPDATE SYNC
function setupAdminForms() {
    // Save/Add Product Form
    document.getElementById('productForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const products = JSON.parse(localStorage.getItem('royale_products')) || DEFAULT_PRODUCTS;

        const newProduct = {
            id: 'p_' + Date.now(),
            title: document.getElementById('prodTitle').value,
            category: document.getElementById('prodCategory').value,
            price: parseFloat(document.getElementById('prodPrice').value),
            image: document.getElementById('prodImage').value
        };

        products.push(newProduct);
        localStorage.setItem('royale_products', JSON.stringify(products));

        // Hide Modal & Refresh Table
        const modalEl = document.getElementById('productModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        renderAdminProductsTable();
    });

    // Homepage CMS Live Editor Form
    document.getElementById('cmsHeroForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmsData = {
            title: document.getElementById('cmsTitleInput').value,
            sub: document.getElementById('cmsSubInput').value,
            desc: document.getElementById('cmsDescInput').value
        };

        localStorage.setItem('royale_cms', JSON.stringify(cmsData));
        alert('Homepage updated successfully! Open index.html to view live changes.');
    });
}

function loadCmsFormValues() {
    const cmsData = JSON.parse(localStorage.getItem('royale_cms')) || {
        title: 'Luxury Beyond Imagination',
        sub: 'HAUTE PARFUMERIE DE PARIS',
        desc: 'Experience timeless elegance and regal prestige with artisanal fragrances crafted by master perfumers.'
    };

    document.getElementById('cmsTitleInput').value = cmsData.title;
    document.getElementById('cmsSubInput').value = cmsData.sub;
    document.getElementById('cmsDescInput').value = cmsData.desc;
}
/**
 * UMAR ROYALE — Atelier Control Center Logic
 * Data sync & Management for Products, Orders, and CMS
 */

// STATE INITIALIZATION & DEFAULTS
const DEFAULT_ADMIN_PRODUCTS = [
    {
        id: 'p1',
        title: 'Royale Essence Extrait',
        category: 'Oud',
        price: 48000,
        rating: 5,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
        description: 'A dark, velvety blend of aged Cambodian Oud, rare saffron, and wild honey.'
    },
    {
        id: 'p2',
        title: 'Velvet Taif Rose',
        category: 'Floral',
        price: 39000,
        rating: 5,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
        description: 'Hand-picked morning Taif roses layered over creamy Mysore sandalwood.'
    },
    {
        id: 'p3',
        title: 'Saffron & Golden Amber',
        category: 'Oriental',
        price: 52000,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
        description: 'Warm golden amber enriched with rare Kashmiri saffron and smoked vanilla.'
    },
    {
        id: 'p4',
        title: 'Monarch Smoke Oud',
        category: 'Oud',
        price: 61000,
        rating: 5,
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=600',
        description: 'Deep, resinous incense mixed with wild leather and royal black agarwood.'
    }
];

// Sample mock orders if none exist
const DEFAULT_ORDERS = [
    {
        id: 'ORD-8921',
        client: 'Lady Eleanor Vance',
        email: 'eleanor@vanceestate.co.uk',
        itemsCount: 2,
        total: 870.00,
        payment: 'Private Concierge Wire',
        status: 'Dispatched',
        date: '2026-07-28'
    },
    {
        id: 'ORD-8922',
        client: 'His Highness Al-Maktoum',
        email: 'concierge@royaloffice.ae',
        itemsCount: 4,
        total: 2100.00,
        payment: 'Credit Card (Amex Black)',
        status: 'Processing',
        date: '2026-07-29'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initNavigationTabs();
    loadDashboardMetrics();
    renderAdminProducts();
    renderOrdersTables();
    loadCmsFormData();
    setupProductFormSubmission();
    setupCmsFormSubmission();

    document.getElementById('refreshMetricsBtn')?.addEventListener('click', () => {
        loadDashboardMetrics();
        renderOrdersTables();
    });

    document.getElementById('clearOrdersBtn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all order records?')) {
            localStorage.setItem('royale_orders', JSON.stringify([]));
            loadDashboardMetrics();
            renderOrdersTables();
        }
    });
});

/* ==========================================================================
   1. NAVIGATION & TAB SWITCHING
   ========================================================================== */
function initNavigationTabs() {
    const tabs = document.querySelectorAll('#adminTabs .nav-link-custom');
    const sections = document.querySelectorAll('.tab-content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            sections.forEach(sec => {
                if (sec.id === `tab-${targetTab}`) {
                    sec.classList.remove('d-none');
                } else {
                    sec.classList.add('d-none');
                }
            });
        });
    });
}

/* ==========================================================================
   2. DASHBOARD METRICS & CALCULATIONS
   ========================================================================== */
function getProducts() {
    return JSON.parse(localStorage.getItem('royale_products')) || DEFAULT_ADMIN_PRODUCTS;
}

function getOrders() {
    return JSON.parse(localStorage.getItem('royale_orders')) || DEFAULT_ORDERS;
}

function loadDashboardMetrics() {
    const orders = getOrders();
    const products = getProducts();

    const totalRevenue = orders.reduce((sum, ord) => sum + (parseFloat(ord.total) || 0), 0);
    const totalOrdersCount = orders.length;
    const avgOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount) : 0;

    document.getElementById('statRevenue').innerText = `Rs. ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    document.getElementById('statOrders').innerText = totalOrdersCount;
    document.getElementById('statProducts').innerText = products.length;
    document.getElementById('statAov').innerText = `Rs. ${avgOrderValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

/* ==========================================================================
   3. PRODUCT CATALOG MANAGEMENT (CRUD)
   ========================================================================== */
function renderAdminProducts() {
    const products = getProducts();
    const tbody = document.getElementById('adminProductsTable');

    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No fragrances in catalog. Click "Add New Fragrance" to begin.</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(p => `
        <tr>
            <td>
                <img src="${p.image}" width="48" height="48" class="rounded object-fit-cover border border-gold-dim">
            </td>
            <td><strong class="text-light">${p.title}</strong></td>
            <td><span class="badge bg-gold-dim text-gold">${p.category}</span></td>
            <td class="gold-text fw-bold">Rs. ${parseFloat(p.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
            <td class="text-gold"><i class="fa-solid fa-star me-1"></i>${p.rating}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-gold me-2" onclick="prepareEditProduct('${p.id}')">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${p.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function prepareAddProduct() {
    document.getElementById('productModalTitle').innerText = 'Add New Fragrance';
    document.getElementById('prodId').value = '';
    document.getElementById('productForm').reset();
}

function prepareEditProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (!product) return;

    document.getElementById('productModalTitle').innerText = 'Edit Fragrance';
    document.getElementById('prodId').value = product.id;
    document.getElementById('prodTitle').value = product.title;
    document.getElementById('prodCategory').value = product.category;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodImage').value = product.image;
    document.getElementById('prodRating').value = product.rating || 5;
    document.getElementById('prodDesc').value = product.description || '';

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function setupProductFormSubmission() {
    const form = document.getElementById('productForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let products = getProducts();
        const id = document.getElementById('prodId').value;
        const newProd = {
            id: id || 'p_' + Date.now(),
            title: document.getElementById('prodTitle').value,
            category: document.getElementById('prodCategory').value,
            price: parseFloat(document.getElementById('prodPrice').value),
            image: document.getElementById('prodImage').value,
            rating: parseFloat(document.getElementById('prodRating').value),
            description: document.getElementById('prodDesc').value
        };

        if (id) {
            // Edit Existing
            products = products.map(p => p.id === id ? newProd : p);
        } else {
            // Add New
            products.push(newProd);
        }

        localStorage.setItem('royale_products', JSON.stringify(products));
        renderAdminProducts();
        loadDashboardMetrics();

        // Close Modal
        const modalEl = document.getElementById('productModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    });
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to remove this fragrance from your catalog?')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        localStorage.setItem('royale_products', JSON.stringify(products));
        renderAdminProducts();
        loadDashboardMetrics();
    }
}

/* ==========================================================================
   4. ORDERS MANAGEMENT & FULFILLMENT
   ========================================================================== */
function renderOrdersTables() {
    const orders = getOrders();
    const recentBody = document.getElementById('recentOrdersTable');
    const fullBody = document.getElementById('fullOrdersTable');

    if (recentBody) {
        recentBody.innerHTML = orders.slice(0, 5).map(ord => `
            <tr>
                <td class="fw-bold text-gold">${ord.id}</td>
                <td>${ord.client}</td>
                <td>${ord.itemsCount || 1} Item(s)</td>
                <td class="gold-text">Rs. ${parseFloat(ord.total).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                <td><span class="badge ${ord.status === 'Dispatched' ? 'bg-success' : 'bg-warning text-dark'}">${ord.status}</span></td>
                <td class="text-muted small">${ord.date}</td>
            </tr>
        `).join('') || `<tr><td colspan="6" class="text-center text-muted">No orders recorded yet.</td></tr>`;
    }

    if (fullBody) {
        fullBody.innerHTML = orders.map(ord => `
            <tr>
                <td class="fw-bold text-gold">${ord.id}</td>
                <td>
                    <div class="fw-bold">${ord.client}</div>
                    <small class="text-muted">${ord.email}</small>
                </td>
                <td><small>${ord.payment}</small></td>
                <td class="gold-text fw-bold">Rs. ${parseFloat(ord.total).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                <td>
                    <select class="form-select form-select-sm luxury-input-admin" onchange="updateOrderStatus('${ord.id}', this.value)">
                        <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Dispatched" ${ord.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
                        <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteOrder('${ord.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('') || `<tr><td colspan="6" class="text-center text-muted py-4">No order records present.</td></tr>`;
    }
}

function updateOrderStatus(orderId, newStatus) {
    let orders = getOrders();
    orders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem('royale_orders', JSON.stringify(orders));
    loadDashboardMetrics();
}

function deleteOrder(orderId) {
    if (confirm('Delete order record permanently?')) {
        let orders = getOrders();
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('royale_orders', JSON.stringify(orders));
        renderOrdersTables();
        loadDashboardMetrics();
    }
}

/* ==========================================================================
   5. HOMEPAGE CMS DATA SYNC
   ========================================================================== */
function loadCmsFormData() {
    const cmsData = JSON.parse(localStorage.getItem('royale_cms')) || {
        sub: 'ROYAL HAUTE PARFUMERIE',
        title: 'Crowned In Fragrance & Oud',
        desc: 'Experience handcrafted royal essences formulated from rare Cambodian Oud, wild saffron, and Taif roses. Designed for nobility.'
    };

    document.getElementById('cmsSub').value = cmsData.sub;
    document.getElementById('cmsTitle').value = cmsData.title;
    document.getElementById('cmsDesc').value = cmsData.desc;
}

function setupCmsFormSubmission() {
    const form = document.getElementById('cmsForm');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const cmsData = {
            sub: document.getElementById('cmsSub').value,
            desc: document.getElementById('cmsDesc').value
        };

        localStorage.setItem('royale_cms', JSON.stringify(cmsData));
        alert('Homepage content published! Changes are now live on index.html.');
    });
}
/**
 * UMAR ROYALE — Atelier Real-Time Admin Engine
 * Synchronizes directly with index.html storefront state
 */

// Default store data fallback
const DEFAULT_PRODUCTS = [
    { id: 'p1', title: 'Royale Essence Extrait', category: 'Oud', price: 480, rating: 5, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600', description: 'A dark, velvety blend of aged Cambodian Oud.' },
    { id: 'p2', title: 'Velvet Taif Rose', category: 'Floral', price: 390, rating: 5, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600', description: 'Hand-picked morning Taif roses.' },
    { id: 'p3', title: 'Saffron & Golden Amber', category: 'Oriental', price: 520, rating: 4.9, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600', description: 'Warm golden amber enriched with rare Kashmiri saffron.' },
    { id: 'p4', title: 'Monarch Smoke Oud', category: 'Oud', price: 610, rating: 5, image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=600', description: 'Deep, resinous incense mixed with wild leather.' }
];

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    refreshAllData();
    setupProductForm();
    setupCmsForm();

    document.getElementById('btnRefreshData')?.addEventListener('click', () => {
        refreshAllData();
        showNotification("Data synchronized with storefront!");
    });
});

/* ==========================================================================
   1. NAVIGATION & DATA GETTERS
   ========================================================================== */
function initTabs() {
    const tabs = document.querySelectorAll('#adminTabs .nav-link-custom');
    const sections = document.querySelectorAll('.tab-content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            sections.forEach(sec => {
                sec.id === `tab-${target}` ? sec.classList.remove('d-none') : sec.classList.add('d-none');
            });
        });
    });
}

function getProducts() {
    return JSON.parse(localStorage.getItem('royale_products')) || DEFAULT_PRODUCTS;
}

function getOrders() {
    return JSON.parse(localStorage.getItem('royale_orders')) || [];
}

function refreshAllData() {
    renderDashboardStats();
    renderProductsTable();
    renderOrdersTables();
    loadCmsValues();
}

/* ==========================================================================
   2. DASHBOARD STATS CALCULATOR
   ========================================================================== */
function renderDashboardStats() {
    const products = getProducts();
    const orders = getOrders();

    const revenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    const orderCount = orders.length;
    const aov = orderCount > 0 ? (revenue / orderCount) : 0;

    document.getElementById('statRevenue').innerText = `Rs. ${revenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    document.getElementById('statOrders').innerText = orderCount;
    document.getElementById('statProducts').innerText = products.length;
    document.getElementById('statAov').innerText = `Rs. ${aov.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

/* ==========================================================================
   3. PRODUCT CRUD MANAGEMENT (REAL-TIME)
   ========================================================================== */
function renderProductsTable() {
    const products = getProducts();
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No products found. Click "Add New Product".</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image}" width="40" height="40" class="rounded object-fit-cover border border-gold-dim"></td>
            <td class="fw-bold">${p.title}</td>
            <td><span class="badge bg-dark border border-warning text-warning">${p.category}</span></td>
            <td class="text-warning fw-bold">Rs. ${parseFloat(p.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-gold me-1" onclick="prepareEditProduct('${p.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function prepareAddProduct() {
    document.getElementById('productModalTitle').innerText = 'Add Fragrance';
    document.getElementById('prodId').value = '';
    document.getElementById('productForm').reset();
}

function prepareEditProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('productModalTitle').innerText = 'Edit Fragrance';
    document.getElementById('prodId').value = product.id;
    document.getElementById('prodTitle').value = product.title;
    document.getElementById('prodCategory').value = product.category;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodImage').value = product.image;
    document.getElementById('prodDesc').value = product.description || '';

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function setupProductForm() {
    document.getElementById('productForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        let products = getProducts();
        const id = document.getElementById('prodId').value;

        const newProduct = {
            id: id || 'p_' + Date.now(),
            title: document.getElementById('prodTitle').value,
            category: document.getElementById('prodCategory').value,
            price: parseFloat(document.getElementById('prodPrice').value),
            image: document.getElementById('prodImage').value,
            rating: 5,
            description: document.getElementById('prodDesc').value
        };

        if (id) {
            products = products.map(p => p.id === id ? newProduct : p);
        } else {
            products.push(newProduct);
        }

        localStorage.setItem('royale_products', JSON.stringify(products));
        refreshAllData();

        const modalEl = document.getElementById('productModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        showNotification("Product saved & storefront updated!");
    });
}

function deleteProduct(id) {
    if (confirm('Delete this product permanently?')) {
        let products = getProducts().filter(p => p.id !== id);
        localStorage.setItem('royale_products', JSON.stringify(products));
        refreshAllData();
        showNotification("Product deleted successfully.");
    }
}

/* ==========================================================================
   4. ORDERS MANAGEMENT
   ========================================================================== */
function renderOrdersTables() {
    const orders = getOrders();
    const dashBody = document.getElementById('dashOrdersBody');
    const fullBody = document.getElementById('fullOrdersBody');

    const generateRows = (data) => data.map(o => `
        <tr>
            <td class="fw-bold text-warning">${o.id || 'ORD-LIVE'}</td>
            <td>${o.client || 'Valued Customer'}</td>
            <td>Rs. ${parseFloat(o.total || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
            <td><span class="badge badge-status ${o.status === 'Dispatched' ? 'badge-dispatched' : 'badge-processing'}">${o.status || 'Processing'}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteOrder('${o.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');

    if (dashBody) dashBody.innerHTML = orders.length ? generateRows(orders.slice(0, 5)) : `<tr><td colspan="5" class="text-center text-muted">No orders yet. Place an order on the storefront checkout!</td></tr>`;
    if (fullBody) fullBody.innerHTML = orders.length ? generateRows(orders) : `<tr><td colspan="5" class="text-center text-muted py-4">No order records present.</td></tr>`;
}

function deleteOrder(id) {
    if (confirm('Delete order record?')) {
        let orders = getOrders().filter(o => o.id !== id);
        localStorage.setItem('royale_orders', JSON.stringify(orders));
        refreshAllData();
        showNotification("Order record cleared.");
    }
}

function clearAllOrders() {
    if (confirm('Clear all stored order records?')) {
        localStorage.setItem('royale_orders', JSON.stringify([]));
        refreshAllData();
        showNotification("All orders cleared.");
    }
}

/* ==========================================================================
   5. CMS STOREFRONT EDITOR
   ========================================================================== */
function loadCmsValues() {
    const cms = JSON.parse(localStorage.getItem('royale_cms')) || {
        sub: 'ROYAL HAUTE PARFUMERIE',
        title: 'Crowned In Fragrance & Oud',
        desc: 'Experience handcrafted royal essences formulated from rare Cambodian Oud.'
    };

    if (document.getElementById('cmsSub')) document.getElementById('cmsSub').value = cms.sub;
    if (document.getElementById('cmsTitle')) document.getElementById('cmsTitle').value = cms.title;
    if (document.getElementById('cmsDesc')) document.getElementById('cmsDesc').value = cms.desc;
}

function setupCmsForm() {
    document.getElementById('cmsForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmsData = {
            sub: document.getElementById('cmsSub').value,
            title: document.getElementById('cmsTitle').value,
            desc: document.getElementById('cmsDesc').value
        };

        localStorage.setItem('royale_cms', JSON.stringify(cmsData));
        showNotification("Homepage content updated live!");
    });
}

function showNotification(msg) {
    const toast = document.getElementById('toastNotif');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}