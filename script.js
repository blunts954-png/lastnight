/* ==========================================================================
   LAST NIGHT - THE CONTROLLED AFTERMATH
   JavaScript Functionality
   ========================================================================== */

// ==========================================================================
// Configuration
// ==========================================================================

const CONFIG = {
    dropEndTime: getNextDropEndTime(),
    products: [
        {
            id: 1,
            name: 'AFTERMATH HOODIE',
            tagline: 'Heavyweight 420gsm French Terry',
            description: 'Premium heavyweight hoodie crafted from 420gsm French Terry cotton. Features oversized fit, dropped shoulders, and embroidered "ZZZ" logo. The aftermath has never felt this comfortable.',
            price: 185,
            stock: 47,
            badge: 'FLAGSHIP',
            image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/624952561_17985665945942183_4359954073133937075_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=scontent-lax3-2.cdninstagram.com'
        },
        {
            id: 2,
            name: 'ZZZ CARGO PANTS',
            tagline: 'Ripstop Technical Fabric',
            description: 'Technical cargo pants constructed from durable ripstop fabric. Multiple utility pockets, adjustable waist, and articulated knees for unrestricted movement. Built for the streets.',
            price: 165,
            stock: 12,
            badge: null,
            image: 'https://scontent-lax3-1.cdninstagram.com/v/t51.2885-15/631475678_778235714747662_1139167440278001592_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=scontent-lax3-1.cdninstagram.com'
        },
        {
            id: 3,
            name: 'DAWN TEE',
            tagline: 'Oversized Boxy Cut',
            description: 'Relaxed fit tee in heavyweight cotton. Features puff-printed graphic on back and subtle embroidered details. The perfect transition from night to day.',
            price: 75,
            stock: 89,
            badge: null,
            image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/620521851_17985058652942183_4243724319673464720_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=scontent-lax3-2.cdninstagram.com'
        }
    ]
};

function getNextDropEndTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(6, 0, 0, 0); // 6 AM - sunrise
    return tomorrow.getTime();
}

// ==========================================================================
// DOM Elements
// ==========================================================================

const DOM = {
    loader: document.getElementById('loader'),
    cursor: document.getElementById('cursor'),
    cursorFollower: document.getElementById('cursor-follower'),
    nav: document.getElementById('nav'),
    navMenuBtn: document.getElementById('nav-menu-btn'),
    mobileMenu: document.getElementById('mobile-menu'),
    countdown: {
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    },
    blacklistForm: document.getElementById('blacklist-form'),
    blacklistSuccess: document.getElementById('blacklist-success'),
    cardLastFour: document.getElementById('card-last-four'),
    cardDate: document.getElementById('card-date'),
    currentTime: document.getElementById('current-time'),
    modal: document.getElementById('quick-view-modal'),
    modalImage: document.getElementById('modal-image'),
    modalBadge: document.getElementById('modal-badge'),
    modalTitle: document.getElementById('modal-title'),
    modalDescription: document.getElementById('modal-description'),
    modalPrice: document.getElementById('modal-price'),
    modalBtnPrice: document.getElementById('modal-btn-price'),
    cartSidebar: document.getElementById('cart-sidebar'),
    cartOverlay: document.getElementById('cart-overlay'),
    cartToggle: document.getElementById('cart-toggle'),
    cartClose: document.getElementById('cart-close'),
    cartItems: document.getElementById('cart-items'),
    cartFooter: document.getElementById('cart-footer'),
    cartCount: document.getElementById('cart-count'),
    cartTotalPrice: document.getElementById('cart-total-price'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// ==========================================================================
// State
// ==========================================================================

let cart = [];
let selectedSize = 'M';

// ==========================================================================
// Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNavigation();
    initCountdown();
    initProducts();
    initModal();
    initCart();
    initBlacklistForm();
    initStats();
    initTime();
    initSmoothScroll();
    initMobileMenu();
});

// ==========================================================================
// Loader
// ==========================================================================

function initLoader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            DOM.loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 1500);
    });
}

// ==========================================================================
// Custom Cursor
// ==========================================================================

function initCursor() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Main cursor - fast follow
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        DOM.cursor.style.left = `${cursorX - 4}px`;
        DOM.cursor.style.top = `${cursorY - 4}px`;
        
        // Follower - slow follow
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        DOM.cursorFollower.style.left = `${followerX - 20}px`;
        DOM.cursorFollower.style.top = `${followerY - 20}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const hoverTargets = document.querySelectorAll('a, button, .product-card, .community-item');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            DOM.cursor.classList.add('hover');
            DOM.cursorFollower.classList.add('hover');
        });
        target.addEventListener('mouseleave', () => {
            DOM.cursor.classList.remove('hover');
            DOM.cursorFollower.classList.remove('hover');
        });
    });
}

// ==========================================================================
// Navigation
// ==========================================================================

function initNavigation() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            DOM.nav.classList.add('scrolled');
        } else {
            DOM.nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ==========================================================================
// Mobile Menu
// ==========================================================================

function initMobileMenu() {
    DOM.navMenuBtn.addEventListener('click', () => {
        DOM.navMenuBtn.classList.toggle('active');
        DOM.mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Close on link click
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            DOM.navMenuBtn.classList.remove('active');
            DOM.mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// ==========================================================================
// Countdown Timer
// ==========================================================================

function initCountdown() {
    function updateCountdown() {
        const now = Date.now();
        const distance = CONFIG.dropEndTime - now;
        
        if (distance < 0) {
            // Reset for next day
            CONFIG.dropEndTime = getNextDropEndTime();
            return;
        }
        
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        DOM.countdown.hours.textContent = String(hours).padStart(2, '0');
        DOM.countdown.minutes.textContent = String(minutes).padStart(2, '0');
        DOM.countdown.seconds.textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ==========================================================================
// Products
// ==========================================================================

function initProducts() {
    // Add to cart buttons
    const addButtons = document.querySelectorAll('.product-btn');
    addButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(CONFIG.products[index]);
        });
    });
    
    // Quick view
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        const quickView = card.querySelector('.product-quick-view');
        if (quickView) {
            quickView.addEventListener('click', () => {
                openModal(CONFIG.products[index]);
            });
        }
    });
    
    // Mystery box
    const mysteryBtn = document.querySelector('.mystery-btn');
    if (mysteryBtn) {
        mysteryBtn.addEventListener('click', () => {
            addToCart({
                id: 'mystery',
                name: 'THE UNKNOWN BUNDLE',
                tagline: '3 unreleased pieces + accessories',
                price: 285,
                stock: 23,
                badge: 'BUNDLE',
                image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/624952561_17985665945942183_4359954073133937075_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=scontent-lax3-2.cdninstagram.com'
            });
        });
    }
}

// ==========================================================================
// Modal
// ==========================================================================

function initModal() {
    // Close modal
    const closeBtn = DOM.modal.querySelector('.modal-close');
    const backdrop = DOM.modal.querySelector('.modal-backdrop');
    
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // Size selection
    const sizeButtons = DOM.modal.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.textContent;
        });
    });
    
    // Add to cart from modal
    const addBtn = DOM.modal.querySelector('.modal-add-btn');
    addBtn.addEventListener('click', () => {
        const productId = parseInt(DOM.modal.dataset.productId);
        const product = CONFIG.products.find(p => p.id === productId);
        if (product) {
            addToCart(product);
            closeModal();
        }
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(product) {
    DOM.modal.dataset.productId = product.id;
    DOM.modalImage.style.backgroundImage = `url(${product.image})`;
    DOM.modalBadge.textContent = product.badge || 'EXCLUSIVE';
    DOM.modalTitle.textContent = product.name;
    DOM.modalDescription.textContent = product.description;
    DOM.modalPrice.textContent = `$${product.price}`;
    DOM.modalBtnPrice.textContent = `$${product.price}`;
    
    DOM.modal.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeModal() {
    DOM.modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// ==========================================================================
// Cart
// ==========================================================================

function initCart() {
    // Toggle cart
    DOM.cartToggle.addEventListener('click', openCart);
    DOM.cartClose.addEventListener('click', closeCart);
    DOM.cartOverlay.addEventListener('click', closeCart);
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('lastnight_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function openCart() {
    DOM.cartSidebar.classList.add('active');
    DOM.cartOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeCart() {
    DOM.cartSidebar.classList.remove('active');
    DOM.cartOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function addToCart(product) {
    const existingItem = cart.find(item => 
        item.id === product.id && item.size === selectedSize
    );
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            size: selectedSize,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('lastnight_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    DOM.cartCount.textContent = totalItems;
    
    // Update items
    if (cart.length === 0) {
        DOM.cartItems.innerHTML = `
            <div class="cart-empty">
                <span class="cart-empty-icon">🌙</span>
                <p>Your cart is empty</p>
                <span>The night is young...</span>
            </div>
        `;
        DOM.cartFooter.style.display = 'none';
    } else {
        DOM.cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image" style="background-image: url(${item.image});"></div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-size">Size: ${item.size} • Qty: ${item.quantity}</div>
                    <div class="cart-item-price">$${item.price * item.quantity}</div>
                    <button class="cart-item-remove" data-index="${index}">REMOVE</button>
                </div>
            </div>
        `).join('');
        
        // Add remove listeners
        const removeButtons = DOM.cartItems.querySelectorAll('.cart-item-remove');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(parseInt(btn.dataset.index));
            });
        });
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        DOM.cartTotalPrice.textContent = `$${total}`;
        DOM.cartFooter.style.display = 'block';
    }
}

// ==========================================================================
// Toast Notifications
// ==========================================================================

function showToast(message) {
    DOM.toastMessage.textContent = message;
    DOM.toast.classList.add('active');
    
    setTimeout(() => {
        DOM.toast.classList.remove('active');
    }, 3000);
}

// ==========================================================================
// Blacklist Form - SMS Service Integration
// ==========================================================================

// SMS Service Configuration
const SMS_CONFIG = {
    // Choose your SMS service: 'twilio', 'postscript', or 'klaviyo'
    service: 'twilio', // Change this to your preferred service
    
    // API Configuration (these would normally be environment variables)
    // For production, use a backend proxy to protect your API keys
    apiEndpoints: {
        twilio: '/api/sms/subscribe',     // Your backend endpoint for Twilio
        postscript: '/api/sms/subscribe', // Your backend endpoint for Postscript
        klaviyo: '/api/sms/subscribe'     // Your backend endpoint for Klaviyo
    },
    
    // Direct integration configs (for testing only - use backend in production)
    // TWILIO: Requires backend due to CORS and auth requirements
    // POSTSCRIPT: Requires backend due to API key security
    // KLAVIYO: Requires backend due to API key security
};

async function subscribeToSMS(phone, email, metadata = {}) {
    const service = SMS_CONFIG.service;
    const endpoint = SMS_CONFIG.apiEndpoints[service];
    
    const payload = {
        phone: phone,
        email: email,
        list: metadata.list_id || 'lastnight_blacklist',
        source: metadata.source || 'website',
        tags: ['blacklist', 'early_access', 'sms_subscriber'],
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`SMS subscription failed: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('SMS Subscription Error:', error);
        throw error;
    }
}

// Fallback mock function for demo/development
async function mockSubscribeToSMS(phone, email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log the subscription (in real app, this would be sent to your SMS service)
    console.log('📱 SMS Subscription:', {
        phone,
        email,
        service: SMS_CONFIG.service,
        timestamp: new Date().toISOString()
    });
    
    return {
        success: true,
        message: 'Successfully subscribed to SMS notifications',
        subscriber_id: 'sub_' + Math.random().toString(36).substr(2, 9)
    };
}

function initBlacklistForm() {
    DOM.blacklistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = DOM.blacklistForm.querySelector('.blacklist-btn');
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const listId = DOM.blacklistForm.querySelector('input[name="list_id"]')?.value || 'lastnight_blacklist';
        const source = DOM.blacklistForm.querySelector('input[name="source"]')?.value || 'website';
        
        btn.classList.add('loading');
        
        try {
            // Check if backend endpoint is configured
            const endpoint = SMS_CONFIG.apiEndpoints[SMS_CONFIG.service];
            let result;
            
            if (endpoint && !endpoint.includes('your-backend')) {
                // Use real API integration
                result = await subscribeToSMS(phone, email, { list_id: listId, source });
            } else {
                // Use mock for demo/development
                console.log('%c[DEV MODE]', 'color: #ff6b35; font-weight: bold;', 'Using mock SMS subscription');
                result = await mockSubscribeToSMS(phone, email);
            }
            
            if (result.success) {
                // Show success state
                btn.classList.remove('loading');
                DOM.blacklistForm.style.display = 'none';
                DOM.blacklistSuccess.classList.add('show');
                
                // Update card with last 4 digits of phone
                const lastFour = phone.replace(/\D/g, '').slice(-4);
                DOM.cardLastFour.textContent = lastFour || '0000';
                DOM.cardDate.textContent = new Date().toLocaleDateString('en-US', { 
                    month: '2-digit', 
                    year: '2-digit' 
                }).replace('/', '/');
                
                // Store subscription in localStorage
                localStorage.setItem('lastnight_blacklist_subscribed', JSON.stringify({
                    phone: phone.replace(/\D/g, '').slice(-4),
                    date: new Date().toISOString(),
                    subscriber_id: result.subscriber_id
                }));
                
                showToast('Welcome to the Blacklist');
                
                // Optional: Trigger welcome SMS
                // await sendWelcomeSMS(phone);
            }
        } catch (error) {
            btn.classList.remove('loading');
            showToast('Something went wrong. Please try again.');
            console.error('Blacklist form error:', error);
        }
    });
    
    // Phone input formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        e.target.value = value;
    });
}

// ==========================================================================
// Stats Counter Animation
// ==========================================================================

function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => observer.observe(num));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    function update() {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    update();
}

// ==========================================================================
// Live Time
// ==========================================================================

function initTime() {
    function updateTime() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        DOM.currentTime.textContent = time;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// ==========================================================================
// Smooth Scroll
// ==========================================================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ==========================================================================
// Scroll Animations
// ==========================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .community-item, .mystery-box').forEach(el => {
    scrollObserver.observe(el);
});

// ==========================================================================
// Hero Video Fallback
// ==========================================================================

const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    heroVideo.addEventListener('error', () => {
        // Create gradient fallback
        const container = document.querySelector('.hero-video-container');
        container.style.background = `
            linear-gradient(135deg, 
                #000 0%, 
                #0a0a0a 50%, 
                #000 100%
            )
        `;
    });
    
    // If no video source, show fallback immediately
    if (!heroVideo.querySelector('source').getAttribute('src') || 
        heroVideo.querySelector('source').getAttribute('src') === 'assets/hero-video.mp4') {
        const container = document.querySelector('.hero-video-container');
        container.style.background = `
            linear-gradient(135deg, 
                #000 0%, 
                #111 25%,
                #0a0a0a 50%, 
                #111 75%,
                #000 100%
            )
        `;
        heroVideo.style.display = 'none';
    }
}

// ==========================================================================
// Performance: Lazy Load Images
// ==========================================================================

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ==========================================================================
// Export for potential module use
// ==========================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, cart, addToCart, removeFromCart };
}
