/**
 * UMAR ROYALE — Haute Parfumerie
 * Core Storefront Logic & State Management
 */

// STOREFRONT INITIAL STATE & DEFAULTS
const DEFAULT_PRODUCTS = [
    { 
        id: 'p1', 
        title: 'Royale Essence Extrait', 
        category: 'Oud', 
        price: 480, 
        rating: 5,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
        description: 'A dark, velvety blend of aged Cambodian Oud, rare saffron, and wild honey.'
    },
    { 
        id: 'p2', 
        title: 'Velvet Taif Rose', 
        category: 'Floral', 
        price: 390, 
        rating: 5,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
        description: 'Hand-picked morning Taif roses layered over creamy Mysore sandalwood.'
    },
    { 
        id: 'p3', 
        title: 'Saffron & Golden Amber', 
        category: 'Oriental', 
        price: 520, 
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
        description: 'Warm golden amber enriched with rare Kashmiri saffron and smoked vanilla.'
    },
    { 
        id: 'p4', 
        title: 'Monarch Smoke Oud', 
        category: 'Oud', 
        price: 610, 
        rating: 5,
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=600',
        description: 'Deep, resinous incense mixed with wild leather and royal black agarwood.'
    }
];

// Persistent Global States (synced with localStorage)
let cart = JSON.parse(localStorage.getItem('royale_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('royale_wishlist')) || [];
let activeFilter = 'all';

// APPLICATION BOOTSTRAP
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursor();
    renderProducts();
    renderWishlistCount();
    syncCmsContent();
    setupCartAndSearch();
    setupCategoryFiltering();
    injectCheckoutModal();
    setupCheckoutLogic();

    // Scroll Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true });
    }

    // Swiper Testimonials Slider
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonialSwiper', {
            loop: true,
            autoplay: { delay: 4500, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true }
        });
    }
});

/* ==========================================================================
   1. PRELOADER & LUXURY CURSOR ENGINES
   ========================================================================== */
function initPreloader() {
    let progress = 0;
    const fillBar = document.getElementById('progressFill');
    const preloader = document.getElementById('preloader');

    if (!fillBar || !preloader) return;

    const interval = setInterval(() => {
        progress += 12;
        fillBar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            if (typeof gsap !== 'undefined') {
                gsap.to(preloader, { opacity: 0, duration: 0.8, onComplete: () => preloader.style.display = 'none' });
            } else {
                preloader.style.display = 'none';
            }
        }
    }, 40);
}

function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    window.addEventListener('mousemove', (e) => {
        if (typeof gsap !== 'undefined') {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.3 });
        }
    });
}

/* ==========================================================================
   2. PRODUCT RENDERING & CATEGORY FILTERING
   ========================================================================== */
function getProducts() {
    return JSON.parse(localStorage.getItem('royale_products')) || DEFAULT_PRODUCTS;
}

function renderProducts() {
    const products = getProducts();
    const featuredGrid = document.getElementById('featuredProductsGrid');
    const filteredGrid = document.getElementById('filteredProducts');

    // Filter logic
    const displayedProducts = activeFilter === 'all' 
        ? products 
        : products.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

    const generateCardsHtml = (items) => items.map(p => {
        const isWishlisted = wishlist.some(id => id === p.id);
        return `
        <div class="col-md-6 col-lg-3 product-item-wrapper" data-aos="fade-up">
            <div class="glass-card product-card p-3 rounded-4 text-center h-100 position-relative d-flex flex-column justify-content-between">
                
                <!-- Wishlist Toggle Button -->
                <button class="wishlist-btn position-absolute top-0 end-0 m-3 border-0 bg-transparent text-gold fs-5" data-id="${p.id}" title="Toggle Wishlist">
                    <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>

                <div>
                    <img src="${p.image}" alt="${p.title}" class="img-fluid rounded-3 mb-3 object-fit-cover" style="height:240px; width:100%;">
                    <span class="gold-subtitle small d-block mb-1">${p.category}</span>
                    <h4 class="gold-heading fs-5 mb-2">${p.title}</h4>
                    <p class="text-muted small mb-2">${p.description || ''}</p>
                </div>

                <div>
                    <div class="stars mb-2 text-gold small">
                        ${'★'.repeat(Math.floor(p.rating || 5))}${(p.rating % 1 !== 0) ? '½' : ''}
                    </div>
                    <p class="gold-text fs-5 fw-bold mb-3">$${p.price}.00</p>
                    <button class="btn btn-gold w-100 btn-sm add-to-cart-btn" 
                        data-id="${p.id}" 
                        data-title="${p.title}" 
                        data-price="${p.price}"
                        data-image="${p.image}">
                        Add To Bag
                    </button>
                </div>

            </div>
        </div>
        `;
    }).join('');

    if (featuredGrid) featuredGrid.innerHTML = generateCardsHtml(products);
    if (filteredGrid) filteredGrid.innerHTML = generateCardsHtml(displayedProducts);

    attachCardEventListeners();
}

function setupCategoryFiltering() {
    const filterButtons = document.querySelectorAll('.filter-buttons .btn-filter');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeFilter = e.target.dataset.filter;
            
            // Smooth fade animation on grid refresh
            const grid = document.getElementById('filteredProducts');
            if (grid && typeof gsap !== 'undefined') {
                gsap.to(grid, { opacity: 0, duration: 0.2, onComplete: () => {
                    renderProducts();
                    gsap.to(grid, { opacity: 1, duration: 0.3 });
                }});
            } else {
                renderProducts();
            }
        });
    });
}

/* ==========================================================================
   3. WISHLIST PERSISTENCE ENGINE
   ========================================================================== */
function attachCardEventListeners() {
    // Add to Cart
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            addToCart({
                id: target.dataset.id,
                title: target.dataset.title,
                price: parseFloat(target.dataset.price),
                image: target.dataset.image
            });
        });
    });

    // Wishlist Heart Button
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            toggleWishlist(id);
        });
    });
}

function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(itemId => itemId !== id);
    } else {
        wishlist.push(id);
    }
    localStorage.setItem('royale_wishlist', JSON.stringify(wishlist));
    renderProducts();
    renderWishlistCount();
}

function renderWishlistCount() {
    let wishlistBadge = document.getElementById('wishlistCount');
    if (wishlistBadge) {
        wishlistBadge.innerText = wishlist.length;
    }
}

/* ==========================================================================
   4. CART STATE & QUANTITY MANAGEMENT
   ========================================================================== */
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveAndUpdateCart();
    document.getElementById('cartDrawer')?.classList.add('open');
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    saveAndUpdateCart();
}

function saveAndUpdateCart() {
    localStorage.setItem('royale_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const countEl = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartSubtotal');

    if (!container) return;

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    if (countEl) countEl.innerText = totalQty;
    if (totalEl) totalEl.innerText = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-center text-muted py-5">Your royal cart is currently empty.</p>`;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-gold-dim">
            <div class="d-flex align-items-center gap-3">
                <img src="${item.image || 'https://via.placeholder.com/50'}" width="50" height="50" class="rounded object-fit-cover">
                <div>
                    <h6 class="gold-heading m-0 fs-6">${item.title}</h6>
                    <small class="text-gold fw-bold">$${item.price}.00</small>
                </div>
            </div>
            
            <!-- Quantity Control -->
            <div class="d-flex align-items-center gap-2 bg-glass p-1 rounded">
                <button class="btn btn-sm btn-outline-gold px-2 py-0 qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="px-2 small text-light fw-bold">${item.qty}</span>
                <button class="btn btn-sm btn-outline-gold px-2 py-0 qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

function setupCartAndSearch() {
    const drawer = document.getElementById('cartDrawer');
    document.getElementById('cartToggle')?.addEventListener('click', () => drawer?.classList.add('open'));
    document.getElementById('closeCart')?.addEventListener('click', () => drawer?.classList.remove('open'));

    // Instant Search Bar Toggle
    const searchOverlay = document.getElementById('searchOverlay');
    document.getElementById('searchToggle')?.addEventListener('click', () => searchOverlay?.classList.add('open'));
    document.getElementById('closeSearch')?.addEventListener('click', () => searchOverlay?.classList.remove('open'));
    
    // Live Search Logic
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const allProducts = getProducts();
        const matches = allProducts.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
        
        const featuredGrid = document.getElementById('featuredProductsGrid');
        if (featuredGrid && query.length > 1) {
            featuredGrid.innerHTML = matches.map(p => `
                <div class="col-md-6 col-lg-3">
                    <div class="glass-card product-card p-3 rounded-4 text-center">
                        <h4 class="gold-heading fs-6">${p.title}</h4>
                        <p class="gold-text fw-bold">$${p.price}.00</p>
                    </div>
                </div>
            `).join('');
        } else if (query.length === 0) {
            renderProducts();
        }
    });

    updateCartUI();
}

/* ==========================================================================
   5. INTERACTIVE MULTI-STEP CHECKOUT MODAL ENGINE
   ========================================================================== */
function injectCheckoutModal() {
    if (document.getElementById('checkoutModal')) return;

    const modalHtml = `
    <div class="modal fade" id="checkoutModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content bg-dark-luxury border-gold text-light rounded-4 glass-card">
                <div class="modal-header border-gold-dim">
                    <h5 class="modal-title gold-heading fs-4">Royal Checkout</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form id="checkoutForm">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label text-gold small">Full Name</label>
                                <input type="text" class="form-control luxury-input" required placeholder="Lord / Lady Name">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-gold small">Email Address</label>
                                <input type="email" class="form-control luxury-input" required placeholder="concierge@domain.com">
                            </div>
                            <div class="col-12">
                                <label class="form-label text-gold small">Destination Delivery Address</label>
                                <input type="text" class="form-control luxury-input" required placeholder="100 Fifth Avenue, Suite A">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-gold small">Country</label>
                                <input type="text" class="form-control luxury-input" required placeholder="United States / UAE / UK">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-gold small">Payment Method</label>
                                <select class="form-select luxury-input">
                                    <option>Private Concierge Wire</option>
                                    <option>Credit Card (Encrypted Visa / Amex)</option>
                                    <option>Crypto (USDT / BTC)</option>
                                </select>
                            </div>
                        </div>
                        <div class="mt-4 pt-3 border-top border-gold-dim d-flex justify-content-between align-items-center">
                            <div>
                                <span class="text-muted small">Total Due:</span>
                                <h4 class="gold-text m-0 fw-bold" id="checkoutModalTotal">$0.00</h4>
                            </div>
                            <button type="submit" class="btn btn-gold py-3 px-5 text-uppercase fw-bold">Confirm Acquisition</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function setupCheckoutLogic() {
    // Modify Cart Drawer Checkout Button to launch Bootstrap Modal
    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter) {
        const checkoutBtn = cartFooter.querySelector('.btn-gold');
        if (checkoutBtn) {
            checkoutBtn.setAttribute('data-bs-toggle', 'modal');
            checkoutBtn.setAttribute('data-bs-target', '#checkoutModal');
            checkoutBtn.addEventListener('click', () => {
                const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
                const modalTotal = document.getElementById('checkoutModalTotal');
                if (modalTotal) modalTotal.innerText = `$${total.toFixed(2)}`;
                document.getElementById('cartDrawer')?.classList.remove('open');
            });
        }
    }

    // Handle Order Submission
    document.addEventListener('submit', (e) => {
        if (e.target && e.target.id === 'checkoutForm') {
            e.preventDefault();
            
            // Clear Cart
            cart = [];
            saveAndUpdateCart();

            // Hide Modal
            const modalEl = document.getElementById('checkoutModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) modalInstance.hide();
            }

            alert('Thank you for your order. Your UMAR ROYALE order has been placed successfully and dispatched to our atelier.');
        }
    });
}

/* ==========================================================================
   6. CMS REAL-TIME HOMEPAGE SYNC
   ========================================================================== */
function syncCmsContent() {
    const cmsData = JSON.parse(localStorage.getItem('royale_cms'));
    if (!cmsData) return;

    const titleEl = document.getElementById('cmsHeroTitle');
    const subEl = document.getElementById('cmsHeroSub');
    const descEl = document.getElementById('cmsHeroDesc');

    if (titleEl && cmsData.title) titleEl.innerText = cmsData.title;
    if (subEl && cmsData.sub) subEl.innerText = cmsData.sub;
    if (descEl && cmsData.desc) descEl.innerText = cmsData.desc;
}