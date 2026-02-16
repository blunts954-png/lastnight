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

// ==========================================================================
// TICKETS SYSTEM
// ==========================================================================

const TicketSystem = {
    stripe: null,
    elements: null,
    cardElement: null,
    currentTier: null,
    currentQuantity: 1,
    currentEvent: null,

    // Stripe publishable key - replace with your own
    STRIPE_PK: 'pk_test_YOUR_PUBLISHABLE_KEY',
    
    // API endpoints (update for your backend)
    API_URL: '/api/ticket-purchase',

    // Ticket pricing
    TIERS: {
        ga: { name: 'General Admission', price: 45, fee: 5 },
        vip: { name: 'VIP Access', price: 95, fee: 10 },
        table: { name: 'Table Service', price: 500, fee: 25 }
    },

    init() {
        this.loadEventData();
        this.setupBuyButtons();
        this.setupModal();
        this.setupQuantityControls();
        
        // Initialize Stripe if available
        if (typeof Stripe !== 'undefined' && this.STRIPE_PK !== 'pk_test_YOUR_PUBLISHABLE_KEY') {
            this.stripe = Stripe(this.STRIPE_PK);
            this.setupStripeElements();
        }
    },

    loadEventData() {
        // Load event data from localStorage (shared with admin dashboard)
        const events = JSON.parse(localStorage.getItem('ln_events') || '[]');
        this.currentEvent = events.find(e => e.active) || {
            id: 'EVT001',
            name: 'LAST NIGHT: THE CONTROLLED AFTERMATH',
            date: '2026-03-15',
            time: '22:00',
            venue: 'The Warehouse LA'
        };

        // Update event display
        if (this.currentEvent) {
            const date = new Date(this.currentEvent.date);
            const monthEl = document.getElementById('event-month');
            const dayEl = document.getElementById('event-day');
            const nameEl = document.getElementById('event-name-display');
            const timeEl = document.getElementById('event-time-display');
            const venueEl = document.getElementById('event-venue-display');

            if (monthEl) monthEl.textContent = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            if (dayEl) dayEl.textContent = date.getDate();
            if (nameEl) nameEl.textContent = this.currentEvent.name;
            if (venueEl) venueEl.textContent = this.currentEvent.venue;
        }

        // Update ticket availability from stored data
        this.updateTicketAvailability();
    },

    updateTicketAvailability() {
        const events = JSON.parse(localStorage.getItem('ln_events') || '[]');
        const event = events.find(e => e.active);
        
        if (event && event.tiers) {
            event.tiers.forEach(tier => {
                const remaining = tier.quantity - tier.sold;
                const el = document.getElementById(`${tier.id}-remaining`);
                if (el) el.textContent = remaining;
            });
        }
    },

    setupBuyButtons() {
        document.querySelectorAll('.tier-buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tier = btn.dataset.tier;
                this.openCheckout(tier);
            });
        });
    },

    setupModal() {
        const modal = document.getElementById('ticket-checkout-modal');
        const closeBtn = document.getElementById('close-ticket-modal');
        const form = document.getElementById('ticket-checkout-form');
        const doneBtn = document.getElementById('checkout-done');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCheckout());
        }

        if (modal) {
            modal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeCheckout());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        if (doneBtn) {
            doneBtn.addEventListener('click', () => this.closeCheckout());
        }
    },

    setupQuantityControls() {
        const minusBtn = document.getElementById('qty-minus');
        const plusBtn = document.getElementById('qty-plus');
        const qtyDisplay = document.getElementById('ticket-qty');

        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                if (this.currentQuantity > 1) {
                    this.currentQuantity--;
                    qtyDisplay.textContent = this.currentQuantity;
                    this.updatePricing();
                }
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                if (this.currentQuantity < 10) {
                    this.currentQuantity++;
                    qtyDisplay.textContent = this.currentQuantity;
                    this.updatePricing();
                }
            });
        }
    },

    setupStripeElements() {
        this.elements = this.stripe.elements({
            fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Space+Mono&display=swap' }]
        });

        this.cardElement = this.elements.create('card', {
            style: {
                base: {
                    color: '#ffffff',
                    fontFamily: '"Space Mono", monospace',
                    fontSize: '16px',
                    '::placeholder': { color: '#737373' }
                },
                invalid: { color: '#FF3B30' }
            }
        });

        const cardEl = document.getElementById('card-element');
        if (cardEl) {
            this.cardElement.mount('#card-element');
            this.cardElement.on('change', (event) => {
                const errorEl = document.getElementById('card-errors');
                if (errorEl) {
                    errorEl.textContent = event.error ? event.error.message : '';
                }
            });
        }
    },

    openCheckout(tier) {
        this.currentTier = tier;
        this.currentQuantity = 1;
        
        const tierData = this.TIERS[tier];
        const modal = document.getElementById('ticket-checkout-modal');
        
        // Update modal content
        document.getElementById('checkout-event-name').textContent = this.currentEvent?.name || 'LAST NIGHT EVENT';
        document.getElementById('checkout-ticket-type').textContent = tierData.name;
        document.getElementById('ticket-qty').textContent = '1';
        
        this.updatePricing();
        
        // Show modal
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Reset form
        document.getElementById('ticket-checkout-form').reset();
        document.getElementById('ticket-checkout-success').style.display = 'none';
        document.getElementById('ticket-checkout-form').style.display = 'block';
    },

    closeCheckout() {
        const modal = document.getElementById('ticket-checkout-modal');
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    },

    updatePricing() {
        const tierData = this.TIERS[this.currentTier];
        if (!tierData) return;

        const subtotal = tierData.price * this.currentQuantity;
        const fee = tierData.fee * this.currentQuantity;
        const total = subtotal + fee;

        document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('checkout-fee').textContent = `$${fee.toFixed(2)}`;
        document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-ticket-payment');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const customer = {
            firstName: document.getElementById('checkout-fname').value,
            lastName: document.getElementById('checkout-lname').value,
            name: `${document.getElementById('checkout-fname').value} ${document.getElementById('checkout-lname').value}`,
            email: document.getElementById('checkout-email').value,
            phone: document.getElementById('checkout-phone').value
        };

        try {
            // For demo without Stripe backend, simulate purchase
            if (!this.stripe || this.STRIPE_PK === 'pk_test_YOUR_PUBLISHABLE_KEY') {
                await this.simulatePurchase(customer);
                return;
            }

            // Real Stripe integration
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier: this.currentTier,
                    quantity: this.currentQuantity,
                    customer: customer,
                    eventId: this.currentEvent?.id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Payment failed');
            }

            // Confirm payment with Stripe
            const { error, paymentIntent } = await this.stripe.confirmCardPayment(
                data.clientSecret,
                {
                    payment_method: {
                        card: this.cardElement,
                        billing_details: { name: customer.name, email: customer.email }
                    }
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            if (paymentIntent.status === 'succeeded') {
                this.showSuccess(paymentIntent.id);
            }

        } catch (error) {
            console.error('Payment error:', error);
            document.getElementById('card-errors').textContent = error.message;
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    },

    // Generate cryptographically unique ticket ID
    generateUniqueTicketId(eventId) {
        // Create a unique ID combining:
        // - Event ID prefix (for easy identification)
        // - Timestamp in base36
        // - Random hex string (8 chars)
        // - Counter for uniqueness within same millisecond
        const timestamp = Date.now().toString(36).toUpperCase();
        const randomPart = this.generateRandomHex(8);
        const eventPrefix = eventId.replace(/[^A-Z0-9]/gi, '').substring(0, 4).toUpperCase();
        
        return `${eventPrefix}-${timestamp}-${randomPart}`;
    },

    // Generate random hex string
    generateRandomHex(length) {
        const array = new Uint8Array(length / 2);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    },

    // Create QR code data payload with event binding
    createQRPayload(ticketId, eventId) {
        // QR payload includes ticket ID, event ID, and a verification hash
        const payload = {
            t: ticketId,           // Ticket ID
            e: eventId,            // Event ID - binds ticket to specific event
            v: 1,                  // Version number for future compatibility
            ts: Date.now()         // Timestamp for additional uniqueness
        };
        
        // Create a simple hash for integrity verification
        const hashInput = `${ticketId}:${eventId}:LASTNIGHT2026`;
        let hash = 0;
        for (let i = 0; i < hashInput.length; i++) {
            const char = hashInput.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        payload.h = Math.abs(hash).toString(36).toUpperCase();
        
        return JSON.stringify(payload);
    },

    async simulatePurchase(customer) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const eventId = this.currentEvent?.id || 'EVT001';
        const generatedTickets = [];
        
        // Generate unique ticket for each quantity
        for (let i = 0; i < this.currentQuantity; i++) {
            const ticketId = this.generateUniqueTicketId(eventId);
            generatedTickets.push(ticketId);
        }
        
        // Save to localStorage (for admin dashboard)
        this.saveTicketLocally(generatedTickets, customer);
        
        // Show success with first ticket (user can access all via email)
        this.showSuccess(generatedTickets[0], generatedTickets);
    },

    saveTicketLocally(ticketIds, customer) {
        const tickets = JSON.parse(localStorage.getItem('ln_tickets') || '[]');
        const eventId = this.currentEvent?.id || 'EVT001';
        
        ticketIds.forEach((ticketId, index) => {
            // Create QR payload for this specific ticket
            const qrPayload = this.createQRPayload(ticketId, eventId);
            
            tickets.push({
                id: ticketId,
                eventId: eventId,
                qrData: qrPayload,  // Store the full QR payload
                customer: {
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone
                },
                type: this.TIERS[this.currentTier].name,
                tier: this.currentTier,
                price: this.TIERS[this.currentTier].price,
                status: 'valid',
                purchasedAt: new Date().toISOString(),
                usedAt: null,           // Will be set when scanned
                usedByDevice: null      // Track which device scanned it
            });
        });
        
        localStorage.setItem('ln_tickets', JSON.stringify(tickets));
        
        // Update sold count
        const events = JSON.parse(localStorage.getItem('ln_events') || '[]');
        const eventIdx = events.findIndex(e => e.id === (this.currentEvent?.id || 'EVT001'));
        if (eventIdx !== -1) {
            const tierIdx = events[eventIdx].tiers.findIndex(t => t.id === this.currentTier);
            if (tierIdx !== -1) {
                events[eventIdx].tiers[tierIdx].sold += this.currentQuantity;
                localStorage.setItem('ln_events', JSON.stringify(events));
            }
        }
    },

    showSuccess(ticketId, allTicketIds = [ticketId]) {
        const eventId = this.currentEvent?.id || 'EVT001';
        
        // Hide form, show success
        document.getElementById('ticket-checkout-form').style.display = 'none';
        document.getElementById('ticket-checkout-success').style.display = 'block';
        document.getElementById('ticket-id-display').textContent = ticketId;

        // Generate QR code with full payload (event-bound)
        const qrContainer = document.getElementById('ticket-qr');
        if (qrContainer && typeof QRCode !== 'undefined') {
            qrContainer.innerHTML = '';
            
            // Create the QR payload that includes event binding
            const qrPayload = this.createQRPayload(ticketId, eventId);
            
            QRCode.toCanvas(qrContainer, qrPayload, {
                width: 200,
                margin: 2,
                color: { dark: '#00FF41', light: '#000000' },
                errorCorrectionLevel: 'H'  // High error correction for better scanning
            });
            
            // If multiple tickets, show info
            if (allTicketIds.length > 1) {
                const ticketInfo = document.createElement('p');
                ticketInfo.className = 'multiple-tickets-info';
                ticketInfo.innerHTML = `<strong>${allTicketIds.length} tickets</strong> purchased. Each has a unique QR code sent to your email.`;
                qrContainer.after(ticketInfo);
            }
        }

        // Update availability display
        this.updateTicketAvailability();
        
        // Reset submit button
        const submitBtn = document.getElementById('submit-ticket-payment');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
};

// ==========================================================================
// MERCH SHOP SYSTEM
// ==========================================================================

const MerchShop = {
    stripe: null,
    elements: null,
    cardElement: null,
    products: [],
    merchCart: [],

    STRIPE_PK: 'pk_test_YOUR_PUBLISHABLE_KEY',
    API_URL: '/api/merch-purchase',
    SHIPPING_COST: 10,

    init() {
        this.loadProducts();
        this.loadCartFromStorage();
        this.setupFilters();
        this.setupModal();
        this.setupCheckoutButton();
        
        if (typeof Stripe !== 'undefined' && this.STRIPE_PK !== 'pk_test_YOUR_PUBLISHABLE_KEY') {
            this.stripe = Stripe(this.STRIPE_PK);
            this.setupStripeElements();
        }
    },

    loadProducts() {
        // Load from localStorage (shared with admin) or use defaults
        const storedProducts = JSON.parse(localStorage.getItem('ln_products') || 'null');
        
        this.products = storedProducts || [
            {
                id: 'MERCH001',
                name: 'AFTERMATH HOODIE',
                description: 'Premium 420gsm French Terry',
                price: 185,
                stock: 47,
                image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/624952561_17985665945942183_4359954073133937075_n.jpg',
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                category: 'hoodies'
            },
            {
                id: 'MERCH002',
                name: 'ZZZ CARGO PANTS',
                description: 'Ripstop Technical Fabric',
                price: 165,
                stock: 12,
                image: 'https://scontent-lax3-1.cdninstagram.com/v/t51.2885-15/631475678_778235714747662_1139167440278001592_n.jpg',
                sizes: ['S', 'M', 'L', 'XL'],
                category: 'pants'
            },
            {
                id: 'MERCH003',
                name: 'DAWN TEE',
                description: 'Oversized Boxy Cut',
                price: 75,
                stock: 89,
                image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/620521851_17985058652942183_4243724319673464720_n.jpg',
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                category: 'tees'
            },
            {
                id: 'MERCH004',
                name: 'INSOMNIAC CAP',
                description: 'Embroidered ZZZ Logo',
                price: 45,
                stock: 150,
                image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/587284012_826483133619978_10360667013338369_n.jpg',
                sizes: ['ONE SIZE'],
                category: 'accessories'
            },
            {
                id: 'MERCH005',
                name: 'NIGHT SHIFT HOODIE',
                description: 'Lightweight 320gsm Terry',
                price: 145,
                stock: 34,
                image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/627634121_1567497644520035_2563627278548789564_n.jpg',
                sizes: ['S', 'M', 'L', 'XL'],
                category: 'hoodies'
            },
            {
                id: 'MERCH006',
                name: 'STATIC TEE',
                description: 'Noise Print Graphic',
                price: 65,
                stock: 78,
                image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/590314586_17980395947942183_4364496347723700883_n.jpg',
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                category: 'tees'
            }
        ];

        this.renderProducts();
    },

    renderProducts(filter = 'all') {
        const grid = document.getElementById('merch-grid');
        if (!grid) return;

        let filtered = this.products;
        if (filter !== 'all') {
            filtered = this.products.filter(p => p.category === filter);
        }

        grid.innerHTML = filtered.map(product => `
            <div class="merch-card" data-product-id="${product.id}">
                <div class="merch-image-container">
                    <div class="merch-image" style="background-image: url('${product.image}')"></div>
                    <div class="merch-stock ${product.stock < 20 ? 'low' : ''}">
                        <span class="stock-dot"></span>
                        ${product.stock} LEFT
                    </div>
                </div>
                <div class="merch-info">
                    <h4 class="merch-name">${product.name}</h4>
                    <p class="merch-desc">${product.description}</p>
                    <div class="merch-price">$${product.price}</div>
                    <div class="merch-sizes">
                        ${product.sizes.map(size => `
                            <button class="merch-size-btn" data-size="${size}">${size}</button>
                        `).join('')}
                    </div>
                    <button class="merch-add-btn" data-product-id="${product.id}">
                        <span>ADD TO BAG</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        // Setup event listeners
        this.setupProductCards();
    },

    setupProductCards() {
        // Size selection
        document.querySelectorAll('.merch-card').forEach(card => {
            const sizeButtons = card.querySelectorAll('.merch-size-btn');
            sizeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    sizeButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            // First size selected by default
            if (sizeButtons.length > 0) {
                sizeButtons[0].classList.add('active');
            }
        });

        // Add to cart
        document.querySelectorAll('.merch-add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.merch-card');
                const productId = card.dataset.productId;
                const selectedSize = card.querySelector('.merch-size-btn.active');
                
                if (!selectedSize) {
                    showToast('Please select a size');
                    return;
                }

                this.addToMerchCart(productId, selectedSize.dataset.size);
            });
        });
    },

    setupFilters() {
        document.querySelectorAll('.merch-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.merch-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderProducts(btn.dataset.filter);
            });
        });
    },

    addToMerchCart(productId, size) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.merchCart.find(item => 
            item.productId === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.merchCart.push({
                productId: productId,
                name: product.name,
                price: product.price,
                size: size,
                quantity: 1,
                image: product.image
            });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        showToast(`${product.name} added to bag`);
    },

    removeFromMerchCart(productId, size) {
        this.merchCart = this.merchCart.filter(item => 
            !(item.productId === productId && item.size === size)
        );
        this.saveCartToStorage();
        this.updateCartDisplay();
    },

    saveCartToStorage() {
        localStorage.setItem('ln_merch_cart', JSON.stringify(this.merchCart));
    },

    loadCartFromStorage() {
        const stored = localStorage.getItem('ln_merch_cart');
        if (stored) {
            this.merchCart = JSON.parse(stored);
            this.updateCartDisplay();
        }
    },

    updateCartDisplay() {
        // Update cart count in main cart toggle
        const cartCount = document.getElementById('cart-count');
        const totalItems = this.merchCart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    },

    getCartTotal() {
        return this.merchCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    setupCheckoutButton() {
        // Override checkout button to handle merch
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.merchCart.length > 0) {
                    this.openMerchCheckout();
                }
            });
        }
    },

    setupModal() {
        const modal = document.getElementById('merch-checkout-modal');
        const closeBtn = document.getElementById('close-merch-modal');
        const form = document.getElementById('merch-checkout-form');
        const doneBtn = document.getElementById('merch-checkout-done');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeMerchCheckout());
        }

        if (modal) {
            const backdrop = modal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => this.closeMerchCheckout());
            }
        }

        if (form) {
            form.addEventListener('submit', (e) => this.handleMerchSubmit(e));
        }

        if (doneBtn) {
            doneBtn.addEventListener('click', () => this.closeMerchCheckout());
        }
    },

    setupStripeElements() {
        if (!this.stripe) return;
        
        this.elements = this.stripe.elements();
        this.cardElement = this.elements.create('card', {
            style: {
                base: {
                    color: '#ffffff',
                    fontFamily: '"Space Mono", monospace',
                    fontSize: '16px',
                    '::placeholder': { color: '#737373' }
                },
                invalid: { color: '#FF3B30' }
            }
        });

        const cardEl = document.getElementById('merch-card-element');
        if (cardEl && this.cardElement) {
            this.cardElement.mount('#merch-card-element');
        }
    },

    openMerchCheckout() {
        const modal = document.getElementById('merch-checkout-modal');
        if (!modal) return;

        // Render cart items in checkout
        const itemsContainer = document.getElementById('merch-checkout-items');
        itemsContainer.innerHTML = this.merchCart.map(item => `
            <div class="checkout-item">
                <div class="checkout-item-image" style="background-image: url('${item.image}')"></div>
                <div class="checkout-item-info">
                    <div class="checkout-item-name">${item.name}</div>
                    <div class="checkout-item-details">Size: ${item.size} | Qty: ${item.quantity}</div>
                </div>
                <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        // Update totals
        const subtotal = this.getCartTotal();
        const shipping = subtotal >= 150 ? 0 : this.SHIPPING_COST;
        const total = subtotal + shipping;

        document.getElementById('merch-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('merch-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('merch-total').textContent = `$${total.toFixed(2)}`;

        // Show modal
        modal.classList.add('active');
        document.body.classList.add('no-scroll');

        // Reset UI
        document.getElementById('merch-checkout-form').style.display = 'block';
        document.getElementById('merch-checkout-success').style.display = 'none';
    },

    closeMerchCheckout() {
        const modal = document.getElementById('merch-checkout-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    },

    async handleMerchSubmit(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-merch-payment');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const customer = {
            name: `${document.getElementById('merch-fname').value} ${document.getElementById('merch-lname').value}`,
            email: document.getElementById('merch-email').value
        };

        const shipping = {
            address: {
                line1: document.getElementById('merch-address').value,
                city: document.getElementById('merch-city').value,
                state: document.getElementById('merch-state').value,
                postal_code: document.getElementById('merch-zip').value,
                country: 'US'
            }
        };

        try {
            // Demo mode without real Stripe
            if (!this.stripe || this.STRIPE_PK === 'pk_test_YOUR_PUBLISHABLE_KEY') {
                await this.simulateMerchPurchase(customer);
                return;
            }

            // Real Stripe integration
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: this.merchCart,
                    customer: customer,
                    shipping: shipping
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Payment failed');
            }

            const { error, paymentIntent } = await this.stripe.confirmCardPayment(
                data.clientSecret,
                {
                    payment_method: {
                        card: this.cardElement,
                        billing_details: { name: customer.name, email: customer.email }
                    }
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            if (paymentIntent.status === 'succeeded') {
                this.showMerchSuccess(paymentIntent.id);
            }

        } catch (error) {
            console.error('Payment error:', error);
            document.getElementById('merch-card-errors').textContent = error.message;
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    },

    async simulateMerchPurchase(customer) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const orderId = `LN-ORD-${Date.now().toString(36).toUpperCase()}`;
        this.saveOrderLocally(orderId, customer);
        this.showMerchSuccess(orderId);
    },

    saveOrderLocally(orderId, customer) {
        const orders = JSON.parse(localStorage.getItem('ln_orders') || '[]');
        
        orders.push({
            id: orderId,
            customer: customer,
            items: this.merchCart.map(item => ({
                productId: item.productId,
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),
            total: this.getCartTotal() + (this.getCartTotal() >= 150 ? 0 : this.SHIPPING_COST),
            status: 'pending',
            createdAt: new Date().toISOString()
        });

        localStorage.setItem('ln_orders', JSON.stringify(orders));
    },

    showMerchSuccess(orderId) {
        document.getElementById('merch-checkout-form').style.display = 'none';
        document.getElementById('merch-checkout-success').style.display = 'block';
        document.getElementById('order-id-display').textContent = orderId;

        // Clear cart
        this.merchCart = [];
        this.saveCartToStorage();
        this.updateCartDisplay();

        // Reset button
        const submitBtn = document.getElementById('submit-merch-payment');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
};

// ==========================================================================
// Initialize All Systems
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize ticket system
    if (document.getElementById('ticket-tiers-display')) {
        TicketSystem.init();
    }

    // Initialize merch shop
    if (document.getElementById('merch-grid')) {
        MerchShop.init();
    }
});
