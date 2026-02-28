// ========================================
// Webstore Cookies - Main JavaScript
// ========================================

// Data produk (fallback jika backend tidak tersedia)
let products = [
    { id: 1, name: 'Choco Chip Cookies', description: 'Klasik chocolate chip cookies dengan taburan choco chips', price: 25000, image: '🍪', category: 'Classic' },
    { id: 2, name: 'Butter Cookies', description: 'Buttery cookies lembut dengan aroma butter asli', price: 22000, image: '🍪', category: 'Classic' },
    { id: 3, name: 'Oatmeal Raisins', description: 'Oatmeal cookies dengan kismis pilihan', price: 28000, image: '🍪', category: 'Healthy' },
    { id: 4, name: 'Almond Cookies', description: 'Cookies dengan taburan almond renyah', price: 30000, image: '🍪', category: 'Premium' },
    { id: 5, name: 'Red Velvet Cookies', description: 'Red velvet cookies dengan cream cheese', price: 35000, image: '🍪', category: 'Premium' },
    { id: 6, name: 'Matcha Cookies', description: 'Japanese style matcha cookies', price: 32000, image: '🍪', category: 'Special' },
    { id: 7, name: 'Strawberry Cheesecake', description: 'Cookies dengan rasa strawberry cheesecake', price: 38000, image: '🍪', category: 'Special' },
    { id: 8, name: 'Double Choco', description: 'Cookies ganda cokelat dengan dark & milk chocolate', price: 30000, image: '🍪', category: 'Classic' }
];

// Keranjang belanja
let cart = [];

// Format Rupiah
function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Format tanggal
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('id-ID', options);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Load produk dari server
async function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        const response = await fetch('backend/get_products.php');
        const result = await response.json();
        
        if (result.success) {
            products = result.data;
        }
    } catch (error) {
        console.log('Using fallback product data');
    }

    renderProducts();
}

// Render produk ke HTML
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image || '🍪'}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatRupiah(parseFloat(product.price))}</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');
}

// Tambah ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity: 1,
            image: product.image
        });
    }

    updateCartUI();
    showNotification(`${product.name} ditambahkan ke keranjang!`);
}

// Kurangi jumlah item di keranjang
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        removeFromCart(productId);
    }

    updateCartUI();
}

// Hapus dari keranjang
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Item dihapus dari keranjang');
}

// Update UI keranjang
function updateCartUI() {
    // Update cart badge
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Update cart page
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');

    if (cartItemsContainer) {
        if (cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartContent) cartContent.style.display = 'none';
        } else {
            if (cartEmpty) cartEmpty.style.display = 'none';
            if (cartContent) cartContent.style.display = 'block';

            cartItemsContainer.innerHTML = cart.map(item => `
                <tr>
                    <td>
                        <div class="cart-item-image">${item.image || '🍪'}</div>
                    </td>
                    <td>
                        <h4>${item.name}</h4>
                        <p>${formatRupiah(item.price)}</p>
                    </td>
                    <td>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="addToCart(${item.id})">+</button>
                        </div>
                    </td>
                    <td>
                        <strong>${formatRupiah(item.price * item.quantity)}</strong>
                    </td>
                    <td>
                        <button class="btn-remove" onclick="removeFromCart(${item.id})">Hapus</button>
                    </td>
                </tr>
            `).join('');

            if (cartTotal) {
                const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                cartTotal.textContent = formatRupiah(totalAmount);
            }
        }
    }
}

// Get cart data untuk checkout
function getCartData() {
    return cart;
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load produk jika di halaman shop
    if (document.getElementById('products-grid')) {
        loadProducts();
    }

    // Update cart UI
    updateCartUI();

    // Simpan cart ke localStorage
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('cookies_cart', JSON.stringify(cart));
    });

    // Load cart dari localStorage
    const savedCart = localStorage.getItem('cookies_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            cart = [];
        }
    }
});
