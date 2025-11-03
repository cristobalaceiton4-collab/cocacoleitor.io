// ====================================================
// VARIABLES Y ESTADO
// ====================================================
const cartButton = document.querySelector('.cart-button');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartButton = document.querySelector('.close-cart-btn');
const productsGrid = document.querySelector('.products-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.querySelector('.cart-total');
const checkoutButton = document.querySelector('.checkout-btn');

// Variables del Carrusel
const carouselTrack = document.querySelector('.carousel-track');
const newsCards = document.querySelectorAll('.news-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;
const totalCards = newsCards.length;

// Carrito en memoria (sin localStorage según restricciones)
let cart = [];

// ====================================================
// FUNCIONES DEL CARRITO
// ====================================================

/**
 * Abre el modal del carrito
 */
function openCart() {
    cartOverlay.classList.add('open');
    updateCartDisplay();
}

/**
 * Cierra el modal del carrito
 */
function closeCart() {
    cartOverlay.classList.remove('open');
}

/**
 * Añade un producto al carrito o incrementa su cantidad
 * @param {string} productName - Nombre del producto
 * @param {number} productPrice - Precio del producto
 */
function addToCart(productName, productPrice) {
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    updateCartHeader();
    openCart();
}

/**
 * Elimina un producto del carrito
 * @param {string} productName - Nombre del producto a eliminar
 */
function removeItem(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartHeader();
    updateCartDisplay();
}

/**
 * Actualiza el contador de items en el botón del carrito
 */
function updateCartHeader() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartButton.textContent = `🛒 Carrito (${totalItems})`;
}

/**
 * Actualiza la visualización del contenido del carrito
 */
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<li>El carrito está vacío. ¡Añade tu bebida favorita!</li>';
        cartTotalElement.textContent = 'Total: $0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <div class="cart-item-actions">
                <span class="item-price">$${itemTotal.toFixed(2)}</span>
                <button class="remove-item-btn" data-name="${item.name}">🗑️</button>
            </div>
        `;
        cartItemsContainer.appendChild(listItem);
    });

    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

/**
 * Procesa el checkout (finalizar compra)
 */
function processCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. ¡Añade algo primero!');
        return;
    }
    
    alert('🎉 ¡Pedido enviado! Gracias por tu compra.');
    cart = [];
    updateCartHeader();
    updateCartDisplay();
    closeCart();
}

// ====================================================
// FUNCIONES DEL CARRUSEL
// ====================================================

/**
 * Actualiza la posición y visualización del carrusel
 */
function updateCarousel() {
    const cardWidth = carouselTrack.offsetWidth;
    const offset = -currentIndex * cardWidth;
    carouselTrack.style.transform = `translateX(${offset}px)`;
    
    // Actualiza la clase 'current' para mostrar solo la tarjeta actual
    newsCards.forEach((card, index) => {
        card.classList.remove('current');
        if (index === currentIndex) {
            card.classList.add('current');
        }
    });
}

/**
 * Navega a la siguiente tarjeta del carrusel
 */
function nextSlide() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
}

/**
 * Navega a la tarjeta anterior del carrusel
 */
function prevSlide() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
}

// ====================================================
// EVENT LISTENERS
// ====================================================

// Delegación de eventos en la cuadrícula de productos
productsGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const card = e.target.closest('.product-card');
        const productName = card.dataset.name;
        const productPrice = parseFloat(card.dataset.price);
        addToCart(productName, productPrice);
    }
});

// Delegación de eventos en el modal del carrito para eliminar items
cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item-btn')) {
        const productName = e.target.dataset.name;
        removeItem(productName);
    }
});

// Botones del carrito
cartButton.addEventListener('click', openCart);
closeCartButton.addEventListener('click', closeCart);

// Cerrar carrito al hacer clic fuera del modal
cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
        closeCart();
    }
});

// Botón de checkout
checkoutButton.addEventListener('click', processCheckout);

// Navegación del carrusel
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Navegación con teclado para el carrusel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// ====================================================
// INICIALIZACIÓN
// ====================================================

// Inicializar el carrusel al cargar la página
window.addEventListener('load', () => {
    updateCarousel();
    updateCartHeader();
});

// Actualizar carrusel al redimensionar la ventana
window.addEventListener('resize', updateCarousel);

// ====================================================
// AUTO-PLAY DEL CARRUSEL (OPCIONAL)
// ====================================================

// Descomenta las siguientes líneas si quieres que el carrusel sea automático
/*
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 4000); // Cambia cada 4 segundos
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Iniciar auto-play
startAutoPlay();

// Pausar auto-play al pasar el mouse sobre el carrusel
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', stopAutoPlay);
carouselContainer.addEventListener('mouseleave', startAutoPlay);
*/