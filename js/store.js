
(function () {
    'use strict';
    var STORAGE_PRODUCTS = 'royale_store_products';
    var STORAGE_CART = 'royale_cart';
    var STORAGE_ORDERS = 'royale_orders';
    var STORAGE_SETTINGS = 'royale_store_settings';

    var IMG = 'https://images.unsplash.com/';
    var GALLERY_POOL = [
        IMG + 'photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
        IMG + 'photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
        IMG + 'photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
        IMG + 'photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
        IMG + 'photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80',
        IMG + 'photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80',
        IMG + 'photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80',
        IMG + 'photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80'
    ];

    function galleryFor(main, picks) {
        return [main].concat(picks.map(function (i) { return GALLERY_POOL[i]; }));
    }

    var DEFAULT_PRODUCTS = [
        {
            id: 'p1', name: 'Creed Aventus', cat: 'oud', tagline: 'Eau de Parfum',
            price: 28000, rating: 5, stock: 25, bestseller: true,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTdtgoaDk3RMASlJBKJF40GXsDZttGxP4NBi8lc9TxnQ&s=10',
            gallery: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTdtgoaDk3RMASlJBKJF40GXsDZttGxP4NBi8lc9TxnQ&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpq8bOnKeHG38K9qpfgMhZrqiLLbd0TnJHbt2iFu89iQ&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReZfVIiDfbOuNEhHIL4eHFZ9K749_aWT-hU3oGsRhpng&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbU0DRYXEeOofo2ST8ruycAt9HyzxVVgNefUVcnR62SQ&s'],
            description: 'Smoked oud layered over dark amber and a whisper of leather â€” a nocturnal masterpiece.'
        },
        {
            id: 'p2', name: 'CK One', cat: 'floral', tagline: 'Extrait de Parfum',
            price: 32000, rating: 5, stock: 18, bestseller: true,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE0h4IQkpznOTkq5RNj-XYplW4JFrJUZhzTbXkwmafWA&s=10',
            gallery: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE0h4IQkpznOTkq5RNj-XYplW4JFrJUZhzTbXkwmafWA&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcvz4pMChfl9Ut47_XdMXDZGgsjwRLt5abHCjshTjIUw&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx_FiVS4tWXQM7ssFbg1-XcNIBjPGqq0Jq9ilwtIz_ag&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD-j5PxzGKql1SAKsI3tvWR3LI-sg9DeElq7daNfaAjg&s=10'],
            description: 'Damask rose and warm amber woven into an imperial bouquet of rare French elegance.'
        },
        {
            id: 'p3', name: 'Cool Water', cat: 'fresh', tagline: 'Eau de Toilette',
            price: 15000, rating: 4, stock: 40, bestseller: false,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG5HZw4D9CtqHBE-D6GILLrxo5z7Yg2nFVQjPkH-vK4g&s=10',
            gallery: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG5HZw4D9CtqHBE-D6GILLrxo5z7Yg2nFVQjPkH-vK4g&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQH8mRWpLIL6c7fxBuNwUhpNHyesu1Q5yAPlLoEm-H6g&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSylU29-k_cF8k5w7pUsqHtKssmbPyuFy8cAxMpP9JU8A&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCVcBYtPJdMpCPyFhCsW5rcauQpsRULHa0xJvYkW6noQ&s=10'],
            description: 'A crisp, airy eau de toilette kissed with bergamot, musk and cool silver florals.'
        },
        {
            id: 'p4', name: 'White Oud', cat: 'fresh', tagline: 'Oud',
            price: 27000, rating: 5, stock: 15, bestseller: true,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaJ1LsGPBvg7_46sZH9cBmhXjv2QyHhlWJZHFU1HwYfg&s=10',
            gallery: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaJ1LsGPBvg7_46sZH9cBmhXjv2QyHhlWJZHFU1HwYfg&s=10', 'https://notesclub.pk/wp-content/uploads/2024/02/White-OUD-100ml.jpeg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4EEkTQ7Dbv3miSlQp_ek6zQzLeP5nk-61TRAiC0rf1Q&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo-BjoFYTiiXcGGeXs6_tU3BKtzd3BaXl49Rm12tqZEQ&s=10'],
            description: 'Sun-drenched amber, saffron and vanilla â€” the warmth of a desert dusk in a single flacon.'
        },
        {
            id: 'p5', name: 'Aventus Absolu', cat: 'oud', tagline: 'Eau de Parfum',
            price: 18500, rating: 4, stock: 32, bestseller: false,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQamt0LKmM2eFLI3pFMUGdCrLPoyf7n8qwdq7UdnjDb-A&s=10',
            gallery: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQamt0LKmM2eFLI3pFMUGdCrLPoyf7n8qwdq7UdnjDb-A&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVBuor5NTcQcf_mrboU4TQEXoaQhPOrM723Og2A9t3nA&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl_qPCblA6wnoEWYcAdq1eeXc6qQnm6h5PH1DxGjLqZQ&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlUisUZjpY7zHiobZRc2Gb5YHi7a1akOyf92T6ru3t-Q&s=10'],
            description: 'Velvety amber fused with tonka and incense â€” a soft, persistent trail of pure warmth.'
        },
        {
            id: 'p6', name: 'Nishane hacivat', cat: 'floral', tagline: 'Perfume Oil',
            price: 15000, rating: 5, stock: 30, bestseller: false,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmDsq4tdCffPEZsKXktKsh0UNOIYU95ozESmYgb4fbqw&s=10',
            gallery: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmDsq4tdCffPEZsKXktKsh0UNOIYU95ozESmYgb4fbqw&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSelHqY7dPCC4NKi1MUhubpXNL0ztMM5podU_JdR8BhfQ&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1uPXdDnZdGxeDK1WtUwJiZAJTly7pU1AB3yODGWnP_A&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ46lj_o7wH1vyQKv13IWCm-WpuHH7B9-FIcSbn-bMfaw&s=10'],
            description: 'Hand-harvested Taif roses deepened with black agarwood â€” romantic, mysterious, rare.'
        },
        {
            id: 'p7', name: 'OFFICE FOR MEN', cat: 'oud', tagline: 'Perfume Oil',
            price: 17500, rating: 5, stock: 40, bestseller: true,
            image: 'https://scentus.pk/wp-content/uploads/2026/05/Office.png',
            gallery: ['https://scentus.pk/wp-content/uploads/2026/05/Office.png', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkkDpA4aqWRDO_jSltJ14ffrMMcAkjP34c8FMQ4EGDqw&s=10', './assets/images.jpg', GALLERY_POOL[4]],
            description: 'A crisp, confident office scent with notes of bergamot, lavender and clean musk.'
        },
        {
            id: 'p8', name: 'LOCATOSE WHITEs', cat: 'floral', tagline: 'Perfume Oil',
            price: 18000, rating: 5, stock: 40, bestseller: false,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG_JFWUKZxgyU6KXF9FM1NraZTDVstA2DOBg7jlKgwyw&s=10',
            gallery: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG_JFWUKZxgyU6KXF9FM1NraZTDVstA2DOBg7jlKgwyw&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqe5NqNpBmJz1eF9y_NsxST1FU7PJPMefTfH7Sv1yZXA&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw8BILh-oF1XBUUTwOaO_VEgA_qJdr2sEPiT75BAIFZw&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtyAPSMZm3uiHFZyDal1GjoShZpwtj0bH45Jg7_UFqow&s'],
            description: 'A fresh, clean fragrance with notes of white flowers and a hint of vanilla.'
        }
    ];


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
    function getCart() { return read(STORAGE_CART, []); }
    function getOrders() { return read(STORAGE_ORDERS, []); }
    function getSettings() { return read(STORAGE_SETTINGS, {}); }

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
        return 'Rs. ' + Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    function stars(rating) {
        return '\u2605'.repeat(Math.max(1, Math.min(5, Math.round(rating || 5))));
    }

    function isOutOfStock(p) {
        return p.stock !== undefined && Number(p.stock) <= 0;
    }

    function whatsappNumber() {
        return String(getSettings().whatsapp || '923400085347').replace(/[^\d]/g, '');
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
            var gallery = (p.gallery && p.gallery.length) ? p.gallery : [p.image];
            var main = gallery[0];
            var thumbs = gallery.map(function (src, i) {
                return '<button type="button" class="thumb' + (i === 0 ? ' active' : '') + '" data-src="' + esc(src) + '" aria-label="View image ' + (i + 1) + '">' +
                    '<img src="' + esc(src) + '" alt="" loading="lazy" onerror="this.closest(\'.thumb\').style.display=\'none\'">' +
                    '</button>';
            }).join('');
            return '' +
                '<div class="lightbox" id="lb-' + esc(p.id) + '">' +
                '<div class="lightbox-card">' +
                '<a href="#collections" class="panel-close">&times;</a>' +
                '<div class="lightbox-media">' +
                '<img class="lightbox-main" src="' + esc(main) + '" alt="' + esc(p.name) + '" onerror="this.src=\'https://via.placeholder.com/600x600?text=UMAR+ROYALE\'">' +
                (gallery.length > 1 ? '<div class="lightbox-thumbs">' + thumbs + '</div>' : '') +
                '</div>' +
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

        var container = document.getElementById('cartItems');
        var countEl = document.getElementById('cartCount');
        var bagCount = document.getElementById('bagCount');
        var subtotalEl = document.getElementById('cartSubtotal');
        var totalEl = document.getElementById('checkoutTotal');
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

            var name = form.elements['name'].value.trim();
            var phone = form.elements['phone'].value.trim();
            var address = form.elements['address'].value.trim();
            var payment = form.elements['payment'] ? form.elements['payment'].value : '';
            var payAccount = form.elements['payAccount'] ? form.elements['payAccount'].value.trim() : '';
            if (!name || !phone || !address) {
                showToast('Please complete all order fields.');
                return;
            }
            if (!payment) {
                showToast('Please select a payment method.');
                return;
            }
            if (!payAccount) {
                showToast('Please enter your payment account number.');
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
                payment: payment + ' (Advance Payment)',
                payAccount: payAccount,
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
                '*Payment:* ' + payment + ' (Advance Payment)\n' +
                '*Payer Account:* ' + payAccount + '\n\n' +
                '*Note:* Order will be dispatched after the advance payment of ' + money(total) + ' is confirmed. Please send your transaction ID on this number.';

            window.open('https://wa.me/' + whatsappNumber() + '?text=' + encodeURIComponent(msg), '_blank');

            cart = [];
            write(STORAGE_CART, cart);
            renderCart();
            form.reset();
            closeCheckbox('modalChk');
            closeCheckbox('cartChk');
            showToast('Order placed! Complete the advance payment on WhatsApp...');
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
        var thumb = e.target.closest('.lightbox-thumbs .thumb');
        if (thumb) {
            var media = thumb.closest('.lightbox-media');
            var main = media ? media.querySelector('.lightbox-main') : null;
            if (main) main.src = thumb.getAttribute('data-src');
            var thumbs = thumb.parentElement.querySelectorAll('.thumb');
            for (var i = 0; i < thumbs.length; i++) thumbs[i].classList.remove('active');
            thumb.classList.add('active');
            return;
        }
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
