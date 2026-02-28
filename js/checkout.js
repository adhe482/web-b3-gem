// ========================================
// Webstore Cookies - Checkout JavaScript
// ========================================

// Format Rupiah
function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Render order summary di checkout page
function renderOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalElement = document.getElementById('order-total-amount');
    
    if (!orderItemsContainer) return;
    
    const cart = window.getCartData ? window.getCartData() : [];
    const total = window.getCartTotal ? window.getCartTotal() : 0;
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p>Keranjang kosong</p>';
        return;
    }
    
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatRupiah(item.price * item.quantity)}</span>
        </div>
    `).join('');
    
    if (orderTotalElement) {
        orderTotalElement.textContent = formatRupiah(total);
    }
}

// Process checkout
async function processCheckout(event) {
    event.preventDefault();
    
    const customerName = document.getElementById('customer_name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const address = document.getElementById('address')?.value.trim();
    
    // Validasi
    if (!customerName || !phone) {
        showNotification('Mohon lengkapi nama dan nomor WhatsApp!', 'error');
        return;
    }
    
    const cart = window.getCartData ? window.getCartData() : [];
    const total = window.getCartTotal ? window.getCartTotal() : 0;
    
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong!', 'error');
        return;
    }
    
    // Format order details
    const orderDetails = cart.map(item => 
        `${item.name} x${item.quantity} = ${formatRupiah(item.price * item.quantity)}`
    ).join('\n');
    
    // Tampilkan loading
    const submitBtn = document.getElementById('submit-checkout');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Memproses...';
    }
    
    try {
        // Simpan ke database
        const response = await fetch('backend/save_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customer_name: customerName,
                phone: phone,
                address: address,
                order_details: orderDetails,
                total_amount: total
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Hapus cart dari localStorage
            localStorage.removeItem('cookies_cart');
            
            // Redirect ke WhatsApp
            const waNumber = '6281234567890'; // Ganti dengan nomor WhatsApp Anda
            
            const message = `*PESANAN COOKIES* 🧁%0A%0A` +
                `*Nama:* ${customerName}%0A` +
                `*No. WA:* ${phone}%0A` +
                `*Alamat:* ${address || '-'}%0A%0A` +
                `*Detail Pesanan:*%0A${orderDetails}%0A%0A` +
                `*TOTAL:* ${formatRupiah(total)}%0A%0A` +
                `Pesanan #${result.order_id}`;
            
            const waUrl = `https://wa.me/${waNumber}?text=${message}`;
            window.open(waUrl, '_blank');
            
            showNotification('Pesanan berhasil! Anda akan diarahkan ke WhatsApp.', 'success');
            
            // Redirect ke halaman utama setelah 3 detik
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            showNotification(result.message || 'Gagal menyimpan pesanan', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        // Jika error, tetap lanjutkan ke WhatsApp
        const waNumber = '6281234567890';
        
        const message = `*PESANAN COOKIES* 🧁%0A%0A` +
            `*Nama:* ${customerName}%0A` +
            `*No. WA:* ${phone}%0A` +
            `*Alamat:* ${address || '-'}%0A%0A` +
            `*Detail Pesanan:*%0A${orderDetails}%0A%0A` +
            `*TOTAL:* ${formatRupiah(total)}`;
        
        const waUrl = `https://wa.me/${waNumber}?text=${message}`;
        window.open(waUrl, '_blank');
        
        showNotification('Pesanan dikirim ke WhatsApp!', 'success');
        
        localStorage.removeItem('cookies_cart');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Pesan Sekarang';
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderOrderSummary();
    
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', processCheckout);
    }
});
