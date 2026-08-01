/* ==========================================
   UMAR ROYALE - LocalStorage & UI Engine
   ========================================== */

// 8 Baseline Products matching your theme layout
const DEFAULT_PRODUCTS = [
    { 
        id: "1", 
        name: "ROYAL OUD NOIR", 
        category: "EAU DE PARFUM", 
        price: 280.00, 
        stock_quantity: 12, 
        is_bestseller: false,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: "2", 
        name: "IMPERIAL ROSE & AMBER", 
        category: "EXTRAIT DE PARFUM", 
        price: 320.00, 
        stock_quantity: 8, 
        is_bestseller: false,
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: "3", 
        name: "VELVET AMBER INTENSE", 
        category: "EAU DE PARFUM", 
        price: 185.00, 
        stock_quantity: 4, 
        is_bestseller: true,
        image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: "4", 
        name: "IMPERIAL SAFFRON OUD", 
        category: "EXTRAIT DE PARFUM", 
        price: 310.00, 
        stock_quantity: 0, 
        is_bestseller: false,
        image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: "5", 
        name: "ROSE DE TAIF NOIR", 
        category: "PERFUME OIL", 
        price: 150.00, 
        stock_quantity: 15, 
        is_bestseller: true,
        image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: "6", 
        name: "MIDNIGHT MUSK ROYALE", 
        category: "EAU DE PARFUM", 
        price: 195.00, 
        stock_quantity: 3, 
        is_bestseller: false,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: "7", 
        name: "GOLD LEATHER CONCENTREE", 
        category: "LUXURY ATTAR", 
        price: 220.00, 
        stock_quantity: 10, 
        is_bestseller: false,
        image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: "8", 
        name: "SYMPHONY OF OUD", 
        category: "EXTRAIT DE PARFUM", 
        price: 299.00, 
        stock_quantity: 2, 
        is_bestseller: true,
        image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80" 
    }
];

const WHATSAPP_NUMBER = "923400085347";

// LocalStorage helpers
function getProducts() {
    const stored = localStorage.getItem('umar_royale_products');
    if (!stored) {
        localStorage.setItem('umar_royale_products', JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
    }
    return JSON.parse(stored);
}

function saveProducts(products) {
    localStorage.setItem('umar_royale_products', JSON.stringify(products));
    if (document.getElementById('homeProductsContainer')) loadHomeProducts();
    if (document.getElementById('bestsellersContainer')) loadBestsellers();
    if (document.getElementById('adminProductTableBody')) loadAdminProducts();
}

// 🟢 Render Featured / All Products
function loadHomeProducts() {
    const container = document.getElementById('homeProductsContainer');
    if (!container) return;

    const products = getProducts();
    container.innerHTML = products.map(prod => renderProductCardHTML(prod)).join('');
}

// 🟡 Render Bestsellers Section (if present)
function loadBestsellers() {
    const container = document.getElementById('bestsellersContainer');
    if (!container) return;

    const products = getProducts().filter(p => p.is_bestseller || (p.stock_quantity > 0 && p.stock_quantity <= 5));
    container.innerHTML = products.map(prod => renderProductCardHTML(prod, true)).join('');
}

// Card Markup matching screenshot aesthetics
function renderProductCardHTML(prod, isBestsellerSection = false) {
    const stockQty = prod.stock_quantity ?? 0;
    const isOutOfStock = stockQty <= 0;

    const waMessage = encodeURIComponent(`Hello, I want to order ${prod.name} ($${Number(prod.price).toFixed(2)})`);
    const orderLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 border-0 text-center shadow-sm p-3 style-card">
                <div class="position-relative overflow-hidden mb-3">
                    <img src="${prod.image}" class="card-img-top img-fluid" alt="${prod.name}" style="max-height: 260px; object-fit: contain;">
                </div>
                <div class="card-body d-flex flex-column p-0">
                    <small class="text-uppercase text-muted tracking-wide mb-1" style="font-size: 0.75rem;">${prod.category}</small>
                    <h5 class="card-title text-uppercase font-weight-bold mb-2" style="letter-spacing: 1px; font-size: 1rem;">${prod.name}</h5>
                    <p class="card-text text-gold font-weight-bold mb-3">$${Number(prod.price).toFixed(2)}</p>
                    
                    ${isOutOfStock ? 
                        `<button class="btn btn-secondary w-100 py-2 text-uppercase font-weight-bold disabled">Out of Stock</button>` :
                        `<a href="${orderLink}" target="_blank" class="btn btn-dark w-100 py-2 text-uppercase font-weight-bold">Add To Cart</a>`
                    }
                </div>
            </div>
        </div>
    `;
}

// 🔴 Admin Panel Controllers
function loadAdminProducts() {
    const tableBody = document.getElementById('adminProductTableBody');
    if (!tableBody) return;

    const products = getProducts();
    tableBody.innerHTML = products.map((prod, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><img src="${prod.image}" width="40" height="40" style="object-fit:cover;"></td>
            <td><strong>${prod.name}</strong><br><small class="text-muted">${prod.category}</small></td>
            <td>$${Number(prod.price).toFixed(2)}</td>
            <td>${prod.stock_quantity}</td>
            <td>${prod.stock_quantity > 0 ? '<span class="badge bg-success">In Stock</span>' : '<span class="badge bg-danger">Out of Stock</span>'}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${prod.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function deleteProduct(id) {
    if (!confirm("Delete product?")) return;
    const products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
}

document.addEventListener('DOMContentLoaded', () => {
    loadHomeProducts();
    loadBestsellers();
    loadAdminProducts();
});