/*
 * VASAVE CAFE - Main Javascript (v2.0)
 * Logic + Animation Observers
 */

// --- Scroll Animation Observer ---
const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: stop observing once revealed
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// --- Products Database ---
const products = [
    {
        id: 1,
        name: "Signature Cappuccino",
        price: 5.50,
        category: "coffee",
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop",
        description: "Our signature blend espresso topped with microfoam milk and a dusting of cocoa."
    },
    {
        id: 2,
        name: "Caramel Macchiato",
        price: 6.00,
        category: "coffee",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop",
        description: "Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle."
    },
    {
        id: 3,
        name: "Almond Croissant",
        price: 4.50,
        category: "pastry",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
        description: "Buttery, flaky croissant filled with sweet almond frangipane and topped with toasted almonds."
    },
    {
        id: 4,
        name: "Avocado Toast",
        price: 9.50,
        category: "food",
        image: "https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?q=80&w=800&auto=format&fit=crop",
        description: "Sourdough bread topped with smashed avocado, cherry tomatoes, radish, and a sprinkle of chili flakes."
    },
    {
        id: 5,
        name: "Berry Cheesecake",
        price: 7.00,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop",
        description: "Creamy New York style cheesecake topped with a fresh mixed berry compote."
    },
    {
        id: 6,
        name: "Matcha Latte",
        price: 6.50,
        category: "tea",
        image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=800&auto=format&fit=crop",
        description: "Premium ceremonial grade matcha whisked with milk and served over ice for a refreshing antioxidant boost."
    },
    {
        id: 7,
        name: "Cold Brew",
        price: 5.00,
        category: "coffee",
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop",
        description: "Steeped for 18 hours in cold water for a super smooth, full-bodied coffee with low acidity."
    },
    {
        id: 8,
        name: "Belgian Waffle",
        price: 8.50,
        category: "food",
        image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=800&auto=format&fit=crop",
        description: "Thick, fluffy waffle topped with fresh strawberries, whipped cream, and warm maple syrup."
    }
];

// --- State ---
let cart = JSON.parse(localStorage.getItem('vasaveCart')) || [];

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Observe elements for animation
    // 1. Observe elements for animation
    const revealElements = document.querySelectorAll('.reveal, .fade-in-left, .fade-in-right, .fade-up');
    revealElements.forEach(el => observer.observe(el));

    // 2. Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // 3. Mobile Menu
    setupMobileMenu();

    // 4. Cart Logic
    updateCartCount();

    // 5. Page Specifics
    if (document.getElementById('menu-grid')) {
        renderMenu();
        setupFilters();
    }

    if (document.getElementById('product-detail')) {
        loadProductDetail();
    }

    if (document.getElementById('cart-items')) {
        renderCartPage();
    }

    if (document.querySelector('.contact-form')) {
        setupContactForm();
    }
});

// --- Navigation ---
function setupMobileMenu() {
    const btn = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-menu');

    if (btn && nav) {
        btn.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
            if (window.innerWidth <= 768) {
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '70px';
                nav.style.left = '0';
                nav.style.width = '100%';
                nav.style.background = '#fff';
                nav.style.padding = '20px';
                nav.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            }
        });
    }
}

// --- Cart Logic ---
function updateCartCount() {
    const total = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(b => b.textContent = total);
}

function addToCart(id, qty = 1) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity += qty;
    else cart.push({ ...prod, quantity: qty });

    localStorage.setItem('vasaveCart', JSON.stringify(cart));
    updateCartCount();

    // Show Toast (Custom notification instead of alert)
    showToast(`${prod.name} added to cart!`);
}

function showToast(msg) {
    // Create toast element on the fly
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '9999';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function removeFromCart(id) {
    cart = cart.filter(p => p.id !== id);
    localStorage.setItem('vasaveCart', JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
}

function updateQty(id, delta) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) removeFromCart(id);
        else {
            localStorage.setItem('vasaveCart', JSON.stringify(cart));
            renderCartPage();
            updateCartCount();
        }
    }
}

// --- Menu Rendering ---
function renderMenu(filter = 'all') {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    const items = filter === 'all' ? products : products.filter(p => p.category === filter);

    items.forEach((p, index) => {
        // Stagger animation delay
        const delay = index * 50;

        const card = document.createElement('div');
        card.className = 'menu-card reveal';
        card.style.transitionDelay = `${delay}ms`; // custom inline for stagger
        card.innerHTML = `
            <div class="menu-card-img">
                <a href="product.html?id=${p.id}">
                    <img src="${p.image}" alt="${p.name}">
                </a>
            </div>
            <div class="menu-card-content">
                <span style="font-size:0.7rem; text-transform:uppercase; color:var(--accent-orange); letter-spacing:1px; font-weight: 600;">${p.category}</span>
                <a href="product.html?id=${p.id}"><h3 style="font-size:1.4rem; margin: 8px 0; color: var(--primary-brown);">${p.name}</h3></a>
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 20px; line-height: 1.5;">${p.description.substring(0, 60)}...</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
                    <span style="font-weight:700; font-size: 1.2rem; color: var(--primary-brown);">$${p.price.toFixed(2)}</span>
                    <button class="btn-primary" style="padding: 10px 20px; font-size:0.8rem; border-radius: 20px;" onclick="addToCart(${p.id})">ADD</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
        observer.observe(card); // Observe new elements
    });
}

function setupFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btns.forEach(b => b.classList.remove('active')); // CSS needs .active logic for buttons
            e.target.classList.add('active');
            renderMenu(e.target.dataset.category);
        });
    });
}

// --- Product Detail ---
function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const p = products.find(i => i.id === id) || products[0];

    document.getElementById('detail-img').src = p.image;
    document.getElementById('detail-name').textContent = p.name;
    document.getElementById('detail-price').textContent = `$${p.price.toFixed(2)}`;
    document.getElementById('detail-desc').textContent = p.description;

    const qtyInput = document.getElementById('qty-input');
    document.getElementById('add-to-cart-btn').onclick = () => addToCart(p.id, parseInt(qtyInput.value));

    document.getElementById('qty-minus').onclick = () => { if (qtyInput.value > 1) qtyInput.value--; };
    document.getElementById('qty-plus').onclick = () => { qtyInput.value++; };
}

// --- Cart Page ---
function renderCartPage() {
    const tbody = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (!cart.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:40px;">Cart is empty. <a href="menu.html">Shop Menu</a></td></tr>';
        totalEl.textContent = '$0.00';
        return;
    }

    tbody.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:15px;">
                    <img src="${item.image}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                    <a href="product.html?id=${item.id}"><b>${item.name}</b></a>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div style="display:flex; align-items:center; gap:5px;">
                    <button onclick="updateQty(${item.id}, -1)">-</button>
                    <span style="width:20px; text-align:center;">${item.quantity}</span>
                    <button onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button onclick="removeFromCart(${item.id})" style="color:red; background:none; border:none; cursor:pointer;">&times;</button></td>
        `;
        tbody.appendChild(tr);
    });

    totalEl.textContent = '$' + total.toFixed(2);
}

// --- Contact Form ---
function setupContactForm() {
    const form = document.querySelector('.contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Visual feedback
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Message Sent';
            btn.style.background = '#4CAF50';
            form.reset();
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);
        }, 1500);
    });
}
