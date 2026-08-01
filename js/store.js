
(function () {
    'use strict';
    var STORAGE_PRODUCTS = 'royale_store_products';
    var STORAGE_CART     = 'royale_cart';
    var STORAGE_ORDERS   = 'royale_orders';
    var STORAGE_SETTINGS = 'royale_store_settings';

    var DEFAULT_PRODUCTS = [
        {
            id: 'p1', name: 'Royal Oud Noir', cat: 'oud', tagline: 'Eau de Parfum',
            price: 280, rating: 5, stock: 25, bestseller: true,
            image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
            description: 'Smoked oud layered over dark amber and a whisper of leather â€” a nocturnal masterpiece.'
        },
        {
            id: 'p2', name: 'Imperial Rose & Amber', cat: 'floral', tagline: 'Extrait de Parfum',
            price: 320, rating: 5, stock: 18, bestseller: true,
            image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
            description: 'Damask rose and warm amber woven into an imperial bouquet of rare French elegance.'
        },
        {
            id: 'p3', name: 'Silver Mist', cat: 'fresh', tagline: 'Eau de Toilette',
            price: 150, rating: 4, stock: 40, bestseller: false,
            image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
            description: 'A crisp, airy eau de toilette kissed with bergamot, musk and cool silver florals.'
        },
        {
            id: 'p4', name: 'Golden Sands', cat: 'fresh', tagline: 'Eau de Parfum',
            price: 270, rating: 5, stock: 15, bestseller: true,
            image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
            description: 'Sun-drenched amber, saffron and vanilla â€” the warmth of a desert dusk in a single flacon.'
        },
        {
            id: 'p5', name: 'Velvet Amber Intense', cat: 'oud', tagline: 'Eau de Parfum',
            price: 185, rating: 4, stock: 0, bestseller: false,
            image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80',
            description: 'Velvety amber fused with tonka and incense â€” a soft, persistent trail of pure warmth.'
        },
        {
            id: 'p6', name: 'Rose de TaÃ¯f Noir', cat: 'floral', tagline: 'Perfume Oil',
            price: 150, rating: 5, stock: 30, bestseller: false,
            image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80',
            description: 'Hand-harvested Taif roses deepened with black agarwood â€” romantic, mysterious, rare.'
        },
        {
            id: 'p7', name: 'OFFICE FOR MEN', cat: 'oud', tagline: 'Perfume Oil',
            price: 175, rating: 5, stock: 40, bestseller: false,
            image: 'https://scentus.pk/wp-content/uploads/2026/05/Office.png',
            description: 'Hand-harvested Taif roses deepened with black agarwood â€” romantic, mysterious, rare.'
        }
    ];

    /* ------------------------------------------------------------------
       1. DATA LAYER  (swap these two functions for a live backend)
       ------------------------------------------------------------------ */
    function read(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (raw !== null) return JSON.parse(raw);
        } catch (err) { /* storage disabled */ }
        return fallback;
    }

    function write(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* ignore */ }
    }

function getProducts() {
    return DEFAULT_PRODUCTS;
}
   function getCart()      { return read(STORAGE_CART, []); }
    function getOrders()    { return read(STORAGE_ORDERS, []); }
    function getSettings()  { return read(STORAGE_SETTINGS, {}); }

    /* ------------------------------------------------------------------
       2. STATE
       ------------------------------------------------------------------ */
    var cart = getCart();
    var searchQuery = '';

    /* ------------------------------------------------------------------
       3. SMALL HELPERS
       ------------------------------------------------------------------ */
    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function money(value) {
        return '$' + Number(value || 0).toFixed(2);
    }

    function stars(rating) {
        return '\u2605'.repeat(Math.max(1, Math.min(5, Math.round(rating || 5))));
    }

    function isOutOfStock(p) {
        return p.stock !== undefined && Number(p.stock) <= 0;
    }

    function whatsappNumber() {
        return String(getSettings().whatsapp || '923092230740').replace(/[^\d]/g, '');
    }

    function openCheckbox(id) {
        var el = document.getElementById(id);
        if (el) el.checked = true;
    }

    function closeCheckbox(id) {
        var el = document.getElementById(id);
        if (el) el.checked = false;
    }

    /* ------------------------------------------------------------------
       4. PRODUCT RENDERING (grid + quick-view lightboxes + carousel)
       ------------------------------------------------------------------ */
    function renderProducts() {
        var grid = document.getElementById('productGrid');
        if (!grid) return;

        var products = getProducts();
        grid.innerHTML = products.map(function (p) {
            var out = isOutOfStock(p);
            return '' +
                '<article class="product' + (out ? ' out-of-stock' : '') + '" data-cat="' + esc(p.cat) + '" data-id="' + esc(p.id) + '">' +
                    '<div class="product-media">' +
                        '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.src=\'https://via.placeholder.com/600x280?text=UMAR+ROYALE\'">' +
                        '<a href="#lb-' + esc(p.id) + '" class="product-quickview"><i class="fa-solid fa-eye"></i> Quick View</a>' +
                        (p.bestseller ? '<span class="product-badge">Bestseller</span>' : (out ? '<span class="product-badge soldout">Sold Out</span>' : '')) +
                    '</div>' +
                    '<div class="product-meta">' +
                        '<span class="product-cat">' + esc(p.tagline || 'Eau de Parfum') + '</span>' +
                        '<h3 class="product-name">' + esc(p.name) + '</h3>' +
                        '<div class="product-price"><b>' + money(p.price) + '</b><span class="stars">' + stars(p.rating) + '</span></div>' +
                        '<button class="product-add" data-add="' + esc(p.id) + '"' + (out ? ' disabled' : '') + '>' + (out ? 'OUT OF STOCK' : 'ADD TO BAG') + '</button>' +
                    '</div>' +
                '</article>';
        }).join('');

        applyFiltersAndSearch();
    }

    function renderLightboxes() {
        var mount = document.getElementById('lightboxMount');
        if (!mount) return;

        var products = getProducts();
        mount.innerHTML = products.map(function (p) {
            var out = isOutOfStock(p);
            return '' +
                '<div class="lightbox" id="lb-' + esc(p.id) + '">' +
                    '<div class="lightbox-card">' +
                        '<a href="#collections" class="panel-close">&times;</a>' +
                        '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '">' +
                        '<div class="lightbox-meta">' +
                            '<span class="eyebrow">' + esc(p.tagline || 'Eau de Parfum') + '</span>' +
                            '<h3>' + esc(p.name) + '</h3>' +
                            '<p>' + esc(p.description || '') + '</p>' +
                            '<b class="gold-text">' + money(p.price) + '</b>' +
                            '<button class="btn-gold" data-add="' + esc(p.id) + '"' + (out ? ' disabled' : '') + '>' + (out ? 'SOLD OUT' : 'Add to Bag') + '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }).join('');
    }

    function renderCarousel() {
        var track = document.getElementById('carouselTrack');
        if (!track) return;

        var products = getProducts();
        var pool = products.length ? products : DEFAULT_PRODUCTS;
        var best = pool.filter(function (p) { return p.bestseller; });
        var ordered = best.concat(pool.filter(function (p) { return !p.bestseller; }));

        var slides = [];
        for (var i = 0; i < 3; i++) slides.push(ordered[i % ordered.length]);

        track.innerHTML = slides.map(function (p, i) {
            var out = isOutOfStock(p);
            return '' +
                '<figure class="slide">' +
                    '<div class="slide-media"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
                    '<figcaption>' +
                        '<span class="slide-num">N\u00ba 0' + (i + 1) + '</span>' +
                        '<span class="eyebrow">House Signature</span>' +
                        '<h3>' + esc(p.name) + '</h3>' +
                        '<p>' + esc(p.description || '') + '</p>' +
                        '<b class="slide-price">' + money(p.price) + '</b>' +
                        '<button class="btn-ghost" data-add="' + esc(p.id) + '"' + (out ? ' disabled' : '') + '>' + (out ? 'SOLD OUT' : 'Add to Bag') + '</button>' +
                    '</figcaption>' +
                '</figure>';
        }).join('');
    }

    /* ------------------------------------------------------------------
       5. FILTER + LIVE SEARCH
       ------------------------------------------------------------------ */
    function applyFiltersAndSearch() {
        var query = searchQuery.trim().toLowerCase();
        var cards = document.querySelectorAll('#productGrid .product');
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var name = (card.querySelector('.product-name') || {}).textContent || '';
            var catEl = (card.querySelector('.product-cat') || {}).textContent || '';
            var haystack = (name + ' ' + card.getAttribute('data-cat') + ' ' + catEl).toLowerCase();
            card.classList.toggle('js-hidden', !!query && haystack.indexOf(query) === -1);
        }
    }

    function setupSearch() {
        var input = document.getElementById('searchInput');
        if (input) {
            input.addEventListener('input', function () {
                searchQuery = input.value;
                applyFiltersAndSearch();
            });
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    closeCheckbox('searchChk');
                    var el = document.getElementById('collections');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        var tags = document.querySelectorAll('.search-tags a');
        for (var i = 0; i < tags.length; i++) {
            (function (tag) {
                tag.addEventListener('click', function (e) {
                    e.preventDefault();
                    var term = (tag.textContent || '').replace('#', '').trim();
                    searchQuery = term;
                    if (input) input.value = term;
                    applyFiltersAndSearch();
                    closeCheckbox('searchChk');
                    var el = document.getElementById('collections');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                });
            })(tags[i]);
        }
    }

    /* ------------------------------------------------------------------
       6. CART ENGINE
       ------------------------------------------------------------------ */
    function addToCart(id) {
        var products = getProducts();
        var product = null;
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === id) { product = products[i]; break; }
        }
        if (!product) return;

        var stock = product.stock !== undefined ? Number(product.stock) : 999;
        if (stock <= 0) { showToast('This fragrance is currently sold out.'); return; }

        cart = getCart();
        var existing = null;
        for (var j = 0; j < cart.length; j++) {
            if (cart[j].id === id) { existing = cart[j]; break; }
        }

        var currentQty = existing ? existing.qty : 0;
        if (currentQty >= stock) { showToast('Only ' + stock + ' in stock â€” no more available.'); return; }

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id: id, name: product.name, price: product.price, image: product.image, qty: 1 });
        }

        saveCart();
        showToast(product.name + ' added to your bag.');
        openCheckbox('cartChk');
    }

    function changeQty(id, delta) {
        cart = getCart();
        var item = null;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === id) { item = cart[i]; break; }
        }
        if (!item) return;

        var products = getProducts();
        var product = null;
        for (var j = 0; j < products.length; j++) {
            if (products[j].id === id) { product = products[j]; break; }
        }
        var stock = product ? (product.stock !== undefined ? Number(product.stock) : 999) : 999;

        var next = item.qty + delta;
        if (next <= 0) {
            cart = cart.filter(function (i) { return i.id !== id; });
        } else if (next > stock) {
            showToast('Maximum available stock reached.');
            return;
        } else {
            item.qty = next;
        }
        saveCart();
    }

    function removeItem(id) {
        cart = cart.filter(function (i) { return i.id !== id; });
        saveCart();
    }

    function saveCart() {
        write(STORAGE_CART, cart);
        renderCart();
    }

    function renderCart() {
        cart = getCart();

        var container  = document.getElementById('cartItems');
        var countEl    = document.getElementById('cartCount');
        var bagCount   = document.getElementById('bagCount');
        var subtotalEl = document.getElementById('cartSubtotal');
        var totalEl    = document.getElementById('checkoutTotal');
        var checkoutBtn = document.getElementById('checkoutBtn');

        var totalQty = 0;
        var totalPrice = 0;
        for (var i = 0; i < cart.length; i++) {
            totalQty += cart[i].qty;
            totalPrice += cart[i].price * cart[i].qty;
        }

        if (countEl) countEl.textContent = totalQty;
        if (bagCount) bagCount.textContent = '(' + totalQty + ')';
        if (subtotalEl) subtotalEl.textContent = money(totalPrice);
        if (totalEl) totalEl.textContent = money(totalPrice);
        if (checkoutBtn) checkoutBtn.classList.toggle('checkout-disabled', cart.length === 0);

        if (!container) return;

        if (!cart.length) {
            container.innerHTML = '<p class="cart-empty">Your bag awaits its first treasure.</p>';
            return;
        }

        container.innerHTML = cart.map(function (item) {
            return '' +
                '<div class="cart-row" data-id="' + esc(item.id) + '">' +
                    '<img src="' + esc(item.image) + '" alt="' + esc(item.name) + '">' +
                    '<div class="cart-row-meta">' +
                        '<strong>' + esc(item.name) + '</strong>' +
                        '<small>' + money(item.price) + ' each</small>' +
                        '<div class="qty-ctrl">' +
                            '<button class="qty-btn" data-qty="-1" aria-label="Decrease">\u2212</button>' +
                            '<span class="qty-num">' + item.qty + '</span>' +
                            '<button class="qty-btn" data-qty="1" aria-label="Increase">+</button>' +
                            '<button class="cart-remove" data-remove="' + esc(item.id) + '"><i class="fa-solid fa-trash-can"></i> Remove</button>' +
                        '</div>' +
                    '</div>' +
                    '<b class="gold-text">' + money(item.price * item.qty) + '</b>' +
                '</div>';
        }).join('');
    }

    function setupCartEvents() {
        var drawer = document.getElementById('cartItems');
        if (drawer) {
            drawer.addEventListener('click', function (e) {
                var qtyBtn = e.target.closest('[data-qty]');
                if (qtyBtn) {
                    var row = qtyBtn.closest('.cart-row');
                    if (row) changeQty(row.getAttribute('data-id'), parseInt(qtyBtn.getAttribute('data-qty'), 10));
                    return;
                }
                var removeBtn = e.target.closest('[data-remove]');
                if (removeBtn) removeItem(removeBtn.getAttribute('data-remove'));
            });
        }

        var checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function (e) {
                if (!getCart().length) {
                    e.preventDefault();
                    showToast('Your bag is empty â€” add a fragrance first.');
                }
            });
        }
    }

    /* ------------------------------------------------------------------
       7. CHECKOUT â€” saves order + WhatsApp notification
       ------------------------------------------------------------------ */
    function setupCheckout() {
        var form = document.getElementById('checkoutForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            cart = getCart();
            if (!cart.length) {
                showToast('Your bag is empty.');
                return;
            }

            var name    = form.elements['name'].value.trim();
            var phone   = form.elements['phone'].value.trim();
            var address = form.elements['address'].value.trim();
            if (!name || !phone || !address) {
                showToast('Please complete all order fields.');
                return;
            }

            var total = cart.reduce(function (sum, i) { return sum + (i.price * i.qty); }, 0);
            var orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
            var order = {
                id: orderId,
                date: new Date().toLocaleString(),
                client: name,
                phone: phone,
                address: address,
                items: cart.map(function (i) {
                    return { id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image };
                }),
                total: Number(total.toFixed(2)),
                payment: 'Cash on Delivery',
                status: 'Pending'
            };

            var orders = getOrders();
            orders.unshift(order);
            write(STORAGE_ORDERS, orders);

            var itemsText = cart.map(function (i) { return '\u2022 ' + i.name + ' (x' + i.qty + ')'; }).join('\n');
            var msg = '*NEW ORDER \u2014 UMAR ROYALE*\n\n' +
                '*Order ID:* ' + orderId + '\n' +
                '*Name:* ' + name + '\n' +
                '*Phone:* ' + phone + '\n' +
                '*Address:* ' + address + '\n\n' +
                '*Items:*\n' + itemsText + '\n\n' +
                '*Total:* ' + money(total) + '\n' +
                '*Payment:* Cash on Delivery';

            window.open('https://wa.me/' + whatsappNumber() + '?text=' + encodeURIComponent(msg), '_blank');

            cart = [];
            write(STORAGE_CART, cart);
            renderCart();
            form.reset();
            closeCheckbox('modalChk');
            closeCheckbox('cartChk');
            showToast('Order placed! Finishing up in WhatsApp...');
        });
    }

    /* ------------------------------------------------------------------
       8. MISC FORMS + TOAST
       ------------------------------------------------------------------ */
    function setupForms() {
        var contactForms = document.querySelectorAll('.contact-form');
        for (var i = 0; i < contactForms.length; i++) {
            (function (f) {
                f.addEventListener('submit', function (e) {
                    e.preventDefault();
                    showToast('Message sent \u2014 our concierge will reply shortly.');
                    f.reset();
                });
            })(contactForms[i]);
        }

        var newsForms = document.querySelectorAll('.news-form');
        for (var j = 0; j < newsForms.length; j++) {
            (function (f) {
                f.addEventListener('submit', function (e) {
                    e.preventDefault();
                    showToast('Welcome to the Maison. Please check your inbox.');
                    f.reset();
                });
            })(newsForms[j]);
        }
    }

    var toastTimer = null;
    function showToast(message) {
        var el = document.getElementById('royaleToast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'royaleToast';
            el.className = 'royale-toast';
            document.body.appendChild(el);
        }
        el.textContent = message;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2800);
    }

    /* ------------------------------------------------------------------
       9. GLOBAL CLICK DELEGATION (add-to-bag anywhere on the page)
       ------------------------------------------------------------------ */
    document.addEventListener('click', function (e) {
        var addBtn = e.target.closest('[data-add]');
        if (addBtn) {
            addToCart(addBtn.getAttribute('data-add'));
            return;
        }
    });

    /* ------------------------------------------------------------------
       10. CROSS-TAB SYNC (storefront & admin stay in sync)
       ------------------------------------------------------------------ */
    window.addEventListener('storage', function (e) {
        if (e.key === STORAGE_CART) { renderCart(); }
        if (e.key === STORAGE_PRODUCTS) { renderProducts(); renderLightboxes(); renderCarousel(); }
        if (e.key === STORAGE_SETTINGS) { /* no live UI needed */ }
    });

    /* ------------------------------------------------------------------
       11. BOOT
       ------------------------------------------------------------------ */
    document.addEventListener('DOMContentLoaded', function () {
        renderProducts();
        renderLightboxes();
        renderCarousel();
        renderCart();
        setupSearch();
        setupCartEvents();
        setupCheckout();
        setupForms();
    });

})();
