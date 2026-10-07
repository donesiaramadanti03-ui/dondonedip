/**
 * Dondonedip Bakery & Dessert Catalog - toko.js
 * Mengelola data produk, rendering dinamis, filter kategori, pencarian, dan keranjang belanja (LocalStorage).
 * Anda bisa mengubah path 'image' di bawah ini dengan nama file gambar Anda sendiri (contoh: 'assets/images/butter-croissant.jpg').
 */

const productsData = [
    { 
        id: 1, 
        name: "Classic Butter Croissant", 
        category: "Pastry", 
        price: 25000, 
        rating: 4.9, 
        reviews: 128, 
        image: "butterquasong.jpeg", 
        description: "Croissant berlapis renyah dengan mentega premium pilihan yang harum dan gurih.", 
        label: "Terlaris" 
    },
    { 
        id: 2, 
        name: "Belgian Dark Chocolate Lava Cake", 
        category: "Cake", 
        price: 45000, 
        rating: 5.0, 
        reviews: 94, 
        image: "coklatlava.jpeg", 
        description: "Kue cokelat lembut dengan lelehan cokelat Belgia murni hangat di bagian dalam.", 
        label: "Terlaris" 
    },
    { 
        id: 3, 
        name: "Strawberry Shortcake Slice", 
        category: "Cake", 
        price: 38000, 
        rating: 4.8, 
        reviews: 76, 
        image: "strawberrycake.jpeg", 
        description: "Sifon sponge cake lembut dipadu krim vanila segar dan buah stroberi segar.", 
        label: "Baru" 
    },
    { 
        id: 4, 
        name: "Matcha Green Tea Macaron (Box of 4)", 
        category: "Cookies", 
        price: 60000, 
        rating: 4.7, 
        reviews: 52, 
        image: "macaron.jpeg", 
        description: "Kue makaron Prancis renyah di luar, lembut dengan isian ganache matcha.", 
        label: "Baru" 
    },
    { 
        id: 5, 
        name: "Creamy Burnt Basque Cheesecake", 
        category: "Cake", 
        price: 48000, 
        rating: 4.9, 
        reviews: 110, 
        image: "basque.jpeg", 
        description: "Kue keju panggang khas San Sebastian dengan tekstur lumer di mulut.", 
        label: "Terlaris" 
    },
    { 
        id: 6, 
        name: "Choco Chip Walnut Cookie", 
        category: "Cookies", 
        price: 22000, 
        rating: 4.6, 
        reviews: 64, 
        image: "kukis.jpeg", 
        description: "Cookie tebal empuk dengan limpahan choco chips dan kacang walnut renyah.", 
        label: "" 
    },
    { 
        id: 7, 
        name: "Caramel Sea Salt Eclair", 
        category: "Pastry", 
        price: 32000, 
        rating: 4.8, 
        reviews: 43, 
        image: "caramel.jpeg", 
        description: "Pastry sus panjang isi vla vanila lembut berlapis saus karamel asin manis.", 
        label: "" 
    },
    { 
        id: 8, 
        name: "Mango Sticky Rice Tart", 
        category: "Pastry", 
        price: 40000, 
        rating: 4.9, 
        reviews: 88, 
        image: "mangotart.jpeg", 
        description: "Tart renyah dengan isian ketan santan gurih dan potongan buah mangga harum.", 
        label: "Baru" 
    },
    { 
        id: 9, 
        name: "Silky Vanilla Panna Cotta", 
        category: "Pudding", 
        price: 30000, 
        rating: 4.7, 
        reviews: 35, 
        image: "pannacotta.jpeg", 
        description: "Puding Italia lembut dengan siraman saus buah beri asam manis menyegarkan.", 
        label: "" 
    },
    { 
        id: 10, 
        name: "Royal Regal Pudding Jar", 
        category: "Pudding", 
        price: 35000, 
        rating: 4.9, 
        reviews: 70, 
        image: "regalpudding.jpeg", 
        description: "Puding susu vanila lapis biskuit Marie Regal dengan vla fla cokelat khas.", 
        label: "Terlaris" 
    },
    { 
        id: 11, 
        name: "Iced Signature Regal Latte", 
        category: "Minuman Manis", 
        price: 28000, 
        rating: 4.8, 
        reviews: 62, 
        image: "regalminum.jpeg", 
        description: "Susu segar manis berpadu espresso lembut dan remahan biskuit Marie Regal.", 
        label: "" 
    },
    { 
        id: 12, 
        name: "Creamy Matcha Boba Frappe", 
        category: "Minuman Manis", 
        price: 32000, 
        rating: 4.9, 
        reviews: 95, 
        image: "matcha.jpeg", 
        description: "Minuman frappe matcha Jepang dingin bertabur krim keju gurih di atasnya.", 
        label: "Baru" 
    }
];

let cart = JSON.parse(localStorage.getItem('dondonedip_cart')) || [];
let activeCategory = 'Semua';
let searchQuery = '';

// DOM Elements
const productGrid = document.getElementById('product-grid');
const categoryFilters = document.getElementById('category-filters');
const searchInput = document.getElementById('search-input');
const productCount = document.getElementById('product-count');
const catalogSubtitle = document.getElementById('catalog-subtitle');
const noResults = document.getElementById('no-results');

const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartDrawer = document.getElementById('cart-drawer');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartPanel = document.getElementById('cart-panel');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartFooter = document.getElementById('cart-footer');
const cartEmptyState = document.getElementById('cart-empty-state');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const whatsappCheckoutBtn = document.getElementById('whatsapp-checkout');
const orderNotesInput = document.getElementById('order-notes');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const toastContainer = document.getElementById('toast-container');

// Helper Format Rupiah
const formatIDR = (num) => 'Rp ' + num.toLocaleString('id-ID');

// Event Listener Utama
window.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    updateCartUI();

    // Event Pencarian Real-Time
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            renderProducts();
        });
    }

    // Event Cart Drawer
    if (cartBtn) cartBtn.addEventListener('click', toggleCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCartDrawer);
    if (cartBackdrop) cartBackdrop.addEventListener('click', toggleCartDrawer);
    if (whatsappCheckoutBtn) whatsappCheckoutBtn.addEventListener('click', handleWhatsAppCheckout);

    // Event Mobile Menu Toggle
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }
});

/* Render Tombol Filter Kategori */
function renderCategories() {
    if (!categoryFilters) return;
    const categories = ['Semua', 'Cake', 'Pastry', 'Cookies', 'Pudding', 'Minuman Manis'];
    categoryFilters.innerHTML = categories.map(cat => `
        <button onclick="filterCategory('${cat}')" 
            class="px-5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition shadow-xs border ${
                activeCategory === cat 
                    ? 'bg-brand-dark text-white border-brand-dark shadow-sm' 
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }">
            ${cat === 'Semua' ? '✨ Semua Menu' : cat}
        </button>
    `).join('');
}

/* Fungsi Global untuk Mengganti Kategori Aktif */
window.filterCategory = function(cat) {
    activeCategory = cat;
    if (catalogSubtitle) {
        catalogSubtitle.textContent = cat === 'Semua' ? 'Semua Produk' : `Kategori: ${cat}`;
    }
    renderCategories();
    renderProducts();
}

/* Render Grid Produk Berdasarkan Filter & Search */
function renderProducts() {
    if (!productGrid) return;

    let filtered = productsData.filter(p => {
        const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (productCount) productCount.textContent = `Menampilkan ${filtered.length} produk`;

    if (filtered.length === 0) {
        productGrid.innerHTML = '';
        if (noResults) noResults.classList.remove('hidden');
        return;
    }

    if (noResults) noResults.classList.add('hidden');
    productGrid.innerHTML = filtered.map(p => `
        <div class="product-card bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
                <div class="relative overflow-hidden aspect-[4/3] bg-stone-100">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" onerror="this.src='https://placehold.co/600x450/FAF7F2/3A3226?text=Dondonedip'">
                    <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-brand-dark text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        ${p.category}
                    </span>
                    ${p.label ? `
                        <span class="absolute top-3 right-3 bg-brand-terracotta text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                            ${p.label}
                        </span>
                    ` : ''}
                </div>
                <div class="p-5">
                    <div class="flex items-center justify-between mb-1.5">
                        <div class="flex items-center text-amber-500 text-xs font-semibold">
                            <i class="fa-solid fa-star mr-1"></i>
                            <span>${p.rating}</span>
                            <span class="text-stone-400 ml-1 font-normal">(${p.reviews})</span>
                        </div>
                    </div>
                    <h3 class="font-serif font-bold text-brand-dark text-base mb-1.5 line-clamp-1">${p.name}</h3>
                    <p class="text-stone-500 text-xs line-clamp-2 mb-4 leading-relaxed">${p.description}</p>
                </div>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between border-t border-stone-100/60 mt-auto pt-4">
                <div>
                    <span class="text-[10px] text-brand-muted block uppercase tracking-wider font-medium">Harga</span>
                    <span class="font-bold text-brand-terracotta text-sm sm:text-base">${formatIDR(p.price)}</span>
                </div>
                <button onclick="addToCart(${p.id})" class="bg-brand-accent hover:bg-brand-primary text-brand-dark hover:text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition shadow-xs flex items-center space-x-1.5">
                    <i class="fa-solid fa-plus text-[10px]"></i>
                    <span>Keranjang</span>
                </button>
            </div>
        </div>
    `).join('');
}

/* Tambah Produk ke Keranjang */
window.addToCart = function(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`Berhasil menambahkan ${product.name} ke keranjang!`);
}

/* Ubah Kuantitas Item di Keranjang (+ / -) */
window.updateQuantity = function(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    saveCart();
    updateCartUI();
}

/* Hapus Item dari Keranjang */
window.removeFromCart = function(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
}

/* Simpan Keranjang ke LocalStorage */
function saveCart() {
    localStorage.setItem('dondonedip_cart', JSON.stringify(cart));
}

/* Perbarui Tampilan Antarmuka Keranjang & Badge */
function updateCartUI() {
    if (!cartCount) return;

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;

    if (cart.length === 0) {
        if (cartEmptyState) cartEmptyState.classList.remove('hidden');
        if (cartFooter) cartFooter.classList.add('hidden');
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';
        return;
    }

    if (cartEmptyState) cartEmptyState.classList.add('hidden');
    if (cartFooter) cartFooter.classList.remove('hidden');

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="py-4 flex items-center space-x-4">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-stone-100 flex-shrink-0" onerror="this.src='https://placehold.co/600x450/FAF7F2/3A3226?text=Dondonedip'">
                <div class="flex-1 min-w-0">
                    <h4 class="font-serif font-bold text-sm text-brand-dark truncate">${item.name}</h4>
                    <p class="text-brand-terracotta text-xs font-semibold mt-0.5">${formatIDR(item.price)}</p>
                    <div class="flex items-center space-x-3 mt-2">
                        <div class="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                            <button onclick="updateQuantity(${item.id}, -1)" class="px-2 py-0.5 text-stone-500 hover:bg-stone-100 transition text-xs">-</button>
                            <span class="px-2.5 text-xs font-semibold text-stone-700">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="px-2 py-0.5 text-stone-500 hover:bg-stone-100 transition text-xs">+</button>
                        </div>
                        <button onclick="removeFromCart(${item.id})" class="text-stone-400 hover:text-red-500 text-xs transition">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = formatIDR(subtotal);
    if (cartTotal) cartTotal.textContent = formatIDR(subtotal);
}

/* Buka/Tutup Drawer Keranjang Belanja */
function toggleCartDrawer() {
    if (!cartDrawer || !cartBackdrop || !cartPanel) return;
    const isHidden = cartDrawer.classList.contains('hidden');
    if (isHidden) {
        cartDrawer.classList.remove('hidden');
        setTimeout(() => {
            cartBackdrop.classList.remove('opacity-0');
            cartPanel.classList.remove('translate-x-full');
        }, 10);
    } else {
        cartBackdrop.classList.add('opacity-0');
        cartPanel.classList.add('translate-x-full');
        setTimeout(() => {
            cartDrawer.classList.add('hidden');
        }, 300);
    }
}

/* Tampilkan Notifikasi Toast Sementara */
function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'bg-brand-dark text-white px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center space-x-2 transform translate-y-2 opacity-0 transition-all duration-300 pointer-events-auto';
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 text-sm"></i><span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 50);

    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* Proses Checkout ke WhatsApp */
function handleWhatsAppCheckout() {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const notes = orderNotesInput ? orderNotesInput.value.trim() : '';

    let message = `Halo Dondonedip, saya ingin memesan menu berikut:\n\n`;
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (${item.quantity}x) - ${formatIDR(item.price * item.quantity)}\n`;
    });
    message += `\n*Subtotal:* ${formatIDR(subtotal)}`;
    if (notes) {
        message += `\n*Catatan:* ${notes}`;
    }
    message += `\n\nMohon konfirmasi ketersediaannya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/6282141558477?text=${encodedMessage}`, '_blank');
}