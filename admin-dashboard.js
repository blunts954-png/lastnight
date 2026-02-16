/* ==========================================================================
   LAST NIGHT - Admin Dashboard
   ========================================================================== */

// ==========================================================================
// Data Store (localStorage-based for demo)
// ==========================================================================

const DataStore = {
    keys: {
        events: 'ln_events',
        tickets: 'ln_tickets',
        products: 'ln_products',
        orders: 'ln_orders',
        settings: 'ln_settings'
    },

    get(key) {
        const data = localStorage.getItem(this.keys[key]);
        return data ? JSON.parse(data) : null;
    },

    set(key, value) {
        localStorage.setItem(this.keys[key], JSON.stringify(value));
    },

    init() {
        // Initialize with sample data if empty
        if (!this.get('events')) {
            this.set('events', [
                {
                    id: 'EVT001',
                    name: 'LAST NIGHT: THE CONTROLLED AFTERMATH',
                    date: '2026-03-15',
                    time: '22:00',
                    venue: 'The Warehouse LA',
                    address: '123 Main St, Los Angeles, CA',
                    tiers: [
                        { id: 'ga', name: 'General Admission', price: 45, quantity: 200, sold: 73 },
                        { id: 'vip', name: 'VIP Access', price: 95, quantity: 50, sold: 27 },
                        { id: 'table', name: 'Table Service', price: 500, quantity: 10, sold: 5 }
                    ],
                    active: true
                }
            ]);
        }

        if (!this.get('tickets')) {
            this.set('tickets', this.generateSampleTickets());
        }

        if (!this.get('products')) {
            this.set('products', [
                {
                    id: 'PROD001',
                    name: 'AFTERMATH HOODIE',
                    description: 'Premium heavyweight hoodie crafted from 420gsm French Terry cotton.',
                    price: 185,
                    stock: 47,
                    image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/624952561_17985665945942183_4359954073133937075_n.jpg',
                    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                    category: 'hoodies',
                    active: true
                },
                {
                    id: 'PROD002',
                    name: 'ZZZ CARGO PANTS',
                    description: 'Technical cargo pants constructed from durable ripstop fabric.',
                    price: 165,
                    stock: 12,
                    image: 'https://scontent-lax3-1.cdninstagram.com/v/t51.2885-15/631475678_778235714747662_1139167440278001592_n.jpg',
                    sizes: ['S', 'M', 'L', 'XL'],
                    category: 'pants',
                    active: true
                },
                {
                    id: 'PROD003',
                    name: 'DAWN TEE',
                    description: 'Relaxed fit tee in heavyweight cotton with puff-printed graphic.',
                    price: 75,
                    stock: 89,
                    image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/620521851_17985058652942183_4243724319673464720_n.jpg',
                    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                    category: 'tees',
                    active: true
                },
                {
                    id: 'PROD004',
                    name: 'INSOMNIAC CAP',
                    description: 'Structured cap with embroidered ZZZ logo.',
                    price: 45,
                    stock: 150,
                    image: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/587284012_826483133619978_10360667013338369_n.jpg',
                    sizes: ['ONE SIZE'],
                    category: 'accessories',
                    active: true
                }
            ]);
        }

        if (!this.get('orders')) {
            this.set('orders', this.generateSampleOrders());
        }
    },

    generateSampleTickets() {
        const tickets = [];
        const names = ['Alex Johnson', 'Sam Williams', 'Jordan Taylor', 'Casey Morgan', 'Riley Brown', 'Quinn Davis', 'Avery Miller', 'Parker Wilson'];
        const types = ['General Admission', 'VIP Access', 'Table Service'];
        const statuses = ['valid', 'valid', 'valid', 'used', 'valid'];
        
        for (let i = 1; i <= 12; i++) {
            tickets.push({
                id: `LN-TICKET-${String(i).padStart(4, '0')}`,
                eventId: 'EVT001',
                customer: {
                    name: names[Math.floor(Math.random() * names.length)],
                    email: `user${i}@example.com`,
                    phone: `+1555${String(Math.random()).slice(2, 9)}`
                },
                type: types[Math.floor(Math.random() * types.length)],
                price: [45, 95, 500][Math.floor(Math.random() * 3)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                purchasedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                checkedInAt: null
            });
        }
        return tickets;
    },

    generateSampleOrders() {
        const orders = [];
        const names = ['Alex Johnson', 'Sam Williams', 'Jordan Taylor', 'Casey Morgan'];
        const statuses = ['pending', 'processing', 'shipped', 'delivered'];
        
        for (let i = 1; i <= 8; i++) {
            orders.push({
                id: `LN-ORD-${String(i).padStart(4, '0')}`,
                customer: {
                    name: names[Math.floor(Math.random() * names.length)],
                    email: `customer${i}@example.com`,
                    address: '123 Main St, Los Angeles, CA 90001'
                },
                items: [
                    { productId: 'PROD001', name: 'AFTERMATH HOODIE', size: 'M', quantity: 1, price: 185 }
                ],
                total: 185 + 10,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        return orders;
    }
};

// ==========================================================================
// Dashboard Controller
// ==========================================================================

const Dashboard = {
    currentTab: 'overview',
    scanner: null,

    init() {
        // Check authentication
        if (typeof AdminAuth !== 'undefined' && !AdminAuth.requireAuth()) {
            return;
        }

        // Initialize data store
        DataStore.init();

        // Set up UI
        this.setupNavigation();
        this.setupTabs();
        this.setupModals();
        this.setupLogout();
        this.updateUserInfo();
        this.setCurrentDate();

        // Load initial data
        this.loadOverview();
    },

    setupNavigation() {
        const tabs = document.querySelectorAll('.admin-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // Card links
        document.querySelectorAll('.card-link[data-tab]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(link.dataset.tab);
            });
        });
    },

    setupTabs() {
        // Initial tab setup done by switching
    },

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.admin-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tabName);
        });

        // Update active section
        document.querySelectorAll('.admin-section').forEach(s => {
            s.classList.toggle('active', s.id === `section-${tabName}`);
        });

        this.currentTab = tabName;

        // Load tab-specific data
        switch(tabName) {
            case 'overview':
                this.loadOverview();
                break;
            case 'tickets':
                this.loadTickets();
                break;
            case 'scanner':
                this.loadScanner();
                break;
            case 'merch':
                this.loadMerch();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    },

    updateUserInfo() {
        const emailEl = document.getElementById('admin-user-email');
        if (emailEl && typeof AdminAuth !== 'undefined') {
            emailEl.textContent = AdminAuth.getCurrentUser() || 'admin@lastnight.com';
        }
    },

    setCurrentDate() {
        const dateEl = document.getElementById('current-date');
        if (dateEl) {
            const now = new Date();
            dateEl.textContent = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    },

    setupLogout() {
        const logoutBtn = document.getElementById('admin-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (typeof AdminAuth !== 'undefined') {
                    AdminAuth.logout();
                } else {
                    window.location.href = 'admin-login.html';
                }
            });
        }
    },

    // =======================================================================
    // Overview Tab
    // =======================================================================

    loadOverview() {
        const tickets = DataStore.get('tickets') || [];
        const orders = DataStore.get('orders') || [];
        const events = DataStore.get('events') || [];

        // Calculate stats
        const totalTickets = tickets.length;
        const checkedIn = tickets.filter(t => t.status === 'used').length;
        const ticketRevenue = tickets.reduce((sum, t) => sum + t.price, 0);
        const merchRevenue = orders.reduce((sum, o) => sum + o.total, 0);
        const totalRevenue = ticketRevenue + merchRevenue;

        // Update stat cards
        document.getElementById('total-tickets').textContent = totalTickets;
        document.getElementById('total-revenue').textContent = `$${totalRevenue.toLocaleString()}`;
        document.getElementById('checked-in').textContent = checkedIn;
        document.getElementById('merch-orders').textContent = orders.length;

        // Update check-in progress
        const progress = totalTickets > 0 ? (checkedIn / totalTickets * 100) : 0;
        const progressBar = document.getElementById('checkin-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Load recent tickets
        this.loadRecentTickets(tickets.slice(-5).reverse());
        
        // Load recent orders
        this.loadRecentOrders(orders.slice(-5).reverse());
    },

    loadRecentTickets(tickets) {
        const container = document.getElementById('recent-tickets');
        if (!container) return;

        container.innerHTML = tickets.map(ticket => `
            <div class="recent-item">
                <div class="recent-info">
                    <span class="recent-name">${ticket.customer.name}</span>
                    <span class="recent-meta">${ticket.type} • ${this.formatDate(ticket.purchasedAt)}</span>
                </div>
                <span class="recent-amount">$${ticket.price}</span>
            </div>
        `).join('') || '<div class="recent-item"><span class="recent-meta">No recent tickets</span></div>';
    },

    loadRecentOrders(orders) {
        const container = document.getElementById('recent-merch');
        if (!container) return;

        container.innerHTML = orders.map(order => `
            <div class="recent-item">
                <div class="recent-info">
                    <span class="recent-name">${order.customer.name}</span>
                    <span class="recent-meta">${order.items[0]?.name || 'Order'} • ${this.formatDate(order.createdAt)}</span>
                </div>
                <span class="recent-amount">$${order.total}</span>
            </div>
        `).join('') || '<div class="recent-item"><span class="recent-meta">No recent orders</span></div>';
    },

    // =======================================================================
    // Tickets Tab
    // =======================================================================

    loadTickets() {
        this.loadEventsList();
        this.loadTicketsTable();
        this.setupTicketFilters();
    },

    loadEventsList() {
        const events = DataStore.get('events') || [];
        const container = document.getElementById('events-list');
        if (!container) return;

        container.innerHTML = events.map(event => {
            const totalTickets = event.tiers.reduce((sum, t) => sum + t.quantity, 0);
            const soldTickets = event.tiers.reduce((sum, t) => sum + t.sold, 0);
            const revenue = event.tiers.reduce((sum, t) => sum + (t.sold * t.price), 0);

            return `
                <div class="event-item" data-event-id="${event.id}">
                    <div class="event-item-info">
                        <h4>${event.name}</h4>
                        <span class="event-item-meta">${this.formatEventDate(event.date)} at ${event.time} • ${event.venue}</span>
                    </div>
                    <div class="event-item-stats">
                        <div class="event-stat">
                            <span class="event-stat-value">${soldTickets}/${totalTickets}</span>
                            <span class="event-stat-label">TICKETS</span>
                        </div>
                        <div class="event-stat">
                            <span class="event-stat-value">$${revenue.toLocaleString()}</span>
                            <span class="event-stat-label">REVENUE</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('') || '<p class="empty-state">No events yet. Create your first event!</p>';
    },

    loadTicketsTable(filter = 'all', search = '') {
        let tickets = DataStore.get('tickets') || [];
        const events = DataStore.get('events') || [];

        // Apply filters
        if (filter !== 'all') {
            tickets = tickets.filter(t => t.status === filter);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            tickets = tickets.filter(t => 
                t.id.toLowerCase().includes(searchLower) ||
                t.customer.name.toLowerCase().includes(searchLower) ||
                t.customer.email.toLowerCase().includes(searchLower)
            );
        }

        const tbody = document.getElementById('tickets-table-body');
        if (!tbody) return;

        tbody.innerHTML = tickets.map(ticket => {
            const event = events.find(e => e.id === ticket.eventId) || { name: 'Unknown Event' };
            return `
                <tr>
                    <td><code>${ticket.id}</code></td>
                    <td>
                        <div>${ticket.customer.name}</div>
                        <small style="color: var(--gray-500)">${ticket.customer.email}</small>
                    </td>
                    <td>${event.name}</td>
                    <td>${ticket.type}</td>
                    <td><span class="status-badge ${ticket.status}">${ticket.status.toUpperCase()}</span></td>
                    <td>${this.formatDate(ticket.purchasedAt)}</td>
                    <td>
                        <button class="action-btn" onclick="Dashboard.viewTicket('${ticket.id}')">View</button>
                        ${ticket.status === 'valid' ? `<button class="action-btn danger" onclick="Dashboard.refundTicket('${ticket.id}')">Refund</button>` : ''}
                    </td>
                </tr>
            `;
        }).join('') || '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No tickets found</td></tr>';
    },

    setupTicketFilters() {
        const filterSelect = document.getElementById('ticket-filter');
        const searchInput = document.getElementById('ticket-search');

        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                this.loadTicketsTable(filterSelect.value, searchInput?.value || '');
            });
        }

        if (searchInput) {
            let debounce;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    this.loadTicketsTable(filterSelect?.value || 'all', searchInput.value);
                }, 300);
            });
        }
    },

    viewTicket(ticketId) {
        const tickets = DataStore.get('tickets') || [];
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
            alert(`Ticket Details:\n\nID: ${ticket.id}\nName: ${ticket.customer.name}\nEmail: ${ticket.customer.email}\nType: ${ticket.type}\nStatus: ${ticket.status}`);
        }
    },

    refundTicket(ticketId) {
        if (!confirm('Are you sure you want to refund this ticket?')) return;
        
        const tickets = DataStore.get('tickets') || [];
        const idx = tickets.findIndex(t => t.id === ticketId);
        if (idx !== -1) {
            tickets[idx].status = 'refunded';
            DataStore.set('tickets', tickets);
            this.loadTicketsTable();
        }
    },

    // =======================================================================
    // Scanner Tab
    // =======================================================================

    loadScanner() {
        this.populateScannerEvents();
        this.setupScannerControls();
        this.updateScannerStats();
    },

    populateScannerEvents() {
        const events = DataStore.get('events') || [];
        const select = document.getElementById('scanner-event');
        if (!select) return;

        select.innerHTML = events.map(e => 
            `<option value="${e.id}">${e.name}</option>`
        ).join('');
    },

    setupScannerControls() {
        const startBtn = document.getElementById('start-scanner');
        const manualBtn = document.getElementById('manual-entry-btn');
        const manualPanel = document.getElementById('manual-entry-panel');
        const validateBtn = document.getElementById('validate-manual');
        const checkInBtn = document.getElementById('check-in-btn');
        const scanNextBtn = document.getElementById('scan-next-btn');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.toggleScanner());
        }

        if (manualBtn && manualPanel) {
            manualBtn.addEventListener('click', () => {
                manualPanel.style.display = manualPanel.style.display === 'none' ? 'block' : 'none';
            });
        }

        if (validateBtn) {
            validateBtn.addEventListener('click', () => {
                const ticketId = document.getElementById('manual-ticket-id').value.trim();
                if (ticketId) {
                    this.validateTicket(ticketId);
                }
            });
        }

        if (checkInBtn) {
            checkInBtn.addEventListener('click', () => this.checkInCurrentTicket());
        }

        if (scanNextBtn) {
            scanNextBtn.addEventListener('click', () => this.resetScannerResult());
        }
    },

    async toggleScanner() {
        const btn = document.getElementById('start-scanner');
        const viewport = document.getElementById('scanner-viewport');

        if (this.scanner) {
            await this.scanner.stop();
            this.scanner = null;
            btn.innerHTML = '<span class="btn-icon">📷</span> START SCANNER';
            btn.classList.remove('active');
            return;
        }

        try {
            // Check if Html5QrcodeScanner is available
            if (typeof Html5Qrcode === 'undefined') {
                throw new Error('QR Scanner library not loaded');
            }

            this.scanner = new Html5Qrcode('scanner-viewport');
            
            await this.scanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => this.onScanSuccess(decodedText),
                (error) => {} // Ignore scan errors
            );

            btn.innerHTML = '<span class="btn-icon">⏹</span> STOP SCANNER';
            btn.classList.add('active');
        } catch (err) {
            console.error('Scanner error:', err);
            alert('Could not start camera. Please use manual entry or check camera permissions.');
        }
    },

    onScanSuccess(scannedData) {
        this.validateTicket(scannedData);
    },

    // Parse QR code data - handles both new JSON format and legacy plain IDs
    parseQRData(scannedData) {
        try {
            // Try to parse as JSON (new format with event binding)
            const payload = JSON.parse(scannedData);
            return {
                ticketId: payload.t,
                eventId: payload.e,
                hash: payload.h,
                version: payload.v || 1,
                isNewFormat: true
            };
        } catch (e) {
            // Legacy format - plain ticket ID
            return {
                ticketId: scannedData,
                eventId: null,
                hash: null,
                version: 0,
                isNewFormat: false
            };
        }
    },

    // Verify the ticket hash for integrity
    verifyTicketHash(ticketId, eventId, providedHash) {
        const hashInput = `${ticketId}:${eventId}:LASTNIGHT2026`;
        let hash = 0;
        for (let i = 0; i < hashInput.length; i++) {
            const char = hashInput.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        const calculatedHash = Math.abs(hash).toString(36).toUpperCase();
        return calculatedHash === providedHash;
    },

    validateTicket(scannedData) {
        const tickets = DataStore.get('tickets') || [];
        const resultCard = document.getElementById('scanner-result');
        const statusDiv = document.getElementById('result-status');
        const selectedEventId = document.getElementById('scanner-event')?.value;
        
        if (!resultCard) return;

        // Parse the QR code data
        const qrData = this.parseQRData(scannedData);
        
        // Find the ticket by ID
        const ticket = tickets.find(t => t.id === qrData.ticketId);
        
        resultCard.style.display = 'block';
        this.currentScannedTicket = ticket;

        // VALIDATION 1: Check if ticket exists
        if (!ticket) {
            statusDiv.className = 'result-status invalid';
            statusDiv.querySelector('.status-icon').textContent = '✗';
            statusDiv.querySelector('.status-text').textContent = 'INVALID TICKET';
            document.getElementById('result-name').textContent = '--';
            document.getElementById('result-type').textContent = '--';
            document.getElementById('result-id').textContent = qrData.ticketId || 'Unknown';
            document.getElementById('check-in-btn').style.display = 'none';
            this.playSound('error');
            return;
        }

        // VALIDATION 2: Check if ticket is for THIS event (prevent reuse across events)
        if (selectedEventId && ticket.eventId !== selectedEventId) {
            statusDiv.className = 'result-status invalid';
            statusDiv.querySelector('.status-icon').textContent = '✗';
            statusDiv.querySelector('.status-text').textContent = 'WRONG EVENT';
            document.getElementById('result-name').textContent = ticket.customer.name;
            document.getElementById('result-type').textContent = `For: ${ticket.eventId}`;
            document.getElementById('result-id').textContent = ticket.id;
            document.getElementById('check-in-btn').style.display = 'none';
            this.playSound('error');
            return;
        }

        // VALIDATION 3: Verify hash integrity (for new format QRs)
        if (qrData.isNewFormat && qrData.hash) {
            if (!this.verifyTicketHash(qrData.ticketId, qrData.eventId, qrData.hash)) {
                statusDiv.className = 'result-status invalid';
                statusDiv.querySelector('.status-icon').textContent = '✗';
                statusDiv.querySelector('.status-text').textContent = 'TAMPERED TICKET';
                document.getElementById('result-name').textContent = '--';
                document.getElementById('result-type').textContent = '--';
                document.getElementById('result-id').textContent = qrData.ticketId;
                document.getElementById('check-in-btn').style.display = 'none';
                this.playSound('error');
                return;
            }
        }

        // VALIDATION 4: Check if already used (one-time use only)
        if (ticket.status === 'used') {
            statusDiv.className = 'result-status used';
            statusDiv.querySelector('.status-icon').textContent = '!';
            statusDiv.querySelector('.status-text').textContent = 'ALREADY USED';
            document.getElementById('result-name').textContent = ticket.customer.name;
            document.getElementById('result-type').textContent = ticket.type;
            document.getElementById('result-id').textContent = ticket.id;
            document.getElementById('check-in-btn').style.display = 'none';
            
            // Show when it was used
            if (ticket.usedAt) {
                const usedDate = new Date(ticket.usedAt);
                const timeAgo = this.getTimeAgo(usedDate);
                statusDiv.querySelector('.status-text').textContent = `USED ${timeAgo.toUpperCase()}`;
            }
            this.playSound('warning');
            return;
        }

        // VALIDATION 5: Check if refunded
        if (ticket.status === 'refunded') {
            statusDiv.className = 'result-status invalid';
            statusDiv.querySelector('.status-icon').textContent = '✗';
            statusDiv.querySelector('.status-text').textContent = 'REFUNDED';
            document.getElementById('result-name').textContent = ticket.customer.name;
            document.getElementById('result-type').textContent = ticket.type;
            document.getElementById('result-id').textContent = ticket.id;
            document.getElementById('check-in-btn').style.display = 'none';
            this.playSound('error');
            return;
        }

        // ALL VALIDATIONS PASSED - Ticket is valid!
        statusDiv.className = 'result-status valid';
        statusDiv.querySelector('.status-icon').textContent = '✓';
        statusDiv.querySelector('.status-text').textContent = 'VALID TICKET';
        document.getElementById('result-name').textContent = ticket.customer.name;
        document.getElementById('result-type').textContent = ticket.type;
        document.getElementById('result-id').textContent = ticket.id;
        document.getElementById('check-in-btn').style.display = 'block';
        this.playSound('success');
    },

    // Helper to get time ago string
    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    },

    // Play feedback sounds
    playSound(type) {
        // Create audio context for feedback sounds
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            if (type === 'success') {
                oscillator.frequency.value = 880; // A5
                oscillator.type = 'sine';
                gainNode.gain.value = 0.3;
            } else if (type === 'warning') {
                oscillator.frequency.value = 440; // A4
                oscillator.type = 'triangle';
                gainNode.gain.value = 0.3;
            } else {
                oscillator.frequency.value = 220; // A3
                oscillator.type = 'sawtooth';
                gainNode.gain.value = 0.2;
            }
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
        } catch (e) {
            // Audio not supported, ignore
        }
    },

    checkInCurrentTicket() {
        if (!this.currentScannedTicket) return;

        const tickets = DataStore.get('tickets') || [];
        const idx = tickets.findIndex(t => t.id === this.currentScannedTicket.id);
        
        if (idx !== -1) {
            // Mark as used with timestamp and device info
            tickets[idx].status = 'used';
            tickets[idx].usedAt = new Date().toISOString();
            tickets[idx].checkedInAt = new Date().toISOString();
            tickets[idx].usedByDevice = navigator.userAgent.substring(0, 100); // Track device
            tickets[idx].checkedInBy = typeof AdminAuth !== 'undefined' ? AdminAuth.getCurrentUser() : 'admin';
            
            DataStore.set('tickets', tickets);
            
            // Update UI
            const statusDiv = document.getElementById('result-status');
            statusDiv.className = 'result-status used';
            statusDiv.querySelector('.status-icon').textContent = '✓';
            statusDiv.querySelector('.status-text').textContent = 'CHECKED IN!';
            document.getElementById('check-in-btn').style.display = 'none';
            
            // Play success sound
            this.playSound('success');
            
            this.updateScannerStats();
        }
    },

    resetScannerResult() {
        document.getElementById('scanner-result').style.display = 'none';
        document.getElementById('manual-ticket-id').value = '';
        this.currentScannedTicket = null;
    },

    updateScannerStats() {
        const tickets = DataStore.get('tickets') || [];
        const eventId = document.getElementById('scanner-event')?.value;
        const eventTickets = eventId ? tickets.filter(t => t.eventId === eventId) : tickets;
        
        const checkedIn = eventTickets.filter(t => t.status === 'used').length;
        const total = eventTickets.length;
        const remaining = eventTickets.filter(t => t.status === 'valid').length;
        const capacity = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

        document.getElementById('scanner-checked-in').textContent = checkedIn;
        document.getElementById('scanner-remaining').textContent = remaining;
        document.getElementById('scanner-capacity').textContent = `${capacity}%`;
    },

    // =======================================================================
    // Merch Tab
    // =======================================================================

    loadMerch() {
        this.loadProductsGrid();
        this.loadOrdersTable();
        this.setupOrderFilters();
    },

    loadProductsGrid() {
        const products = DataStore.get('products') || [];
        const container = document.getElementById('admin-products-grid');
        if (!container) return;

        container.innerHTML = products.map(product => `
            <div class="admin-product-card">
                <div class="admin-product-image" style="background-image: url('${product.image}')"></div>
                <div class="admin-product-name">${product.name}</div>
                <div class="admin-product-price">$${product.price}</div>
                <div class="admin-product-stock">${product.stock} in stock</div>
                <button class="action-btn" onclick="Dashboard.editProduct('${product.id}')">Edit</button>
            </div>
        `).join('');
    },

    loadOrdersTable(filter = 'all') {
        let orders = DataStore.get('orders') || [];

        if (filter !== 'all') {
            orders = orders.filter(o => o.status === filter);
        }

        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td><code>${order.id}</code></td>
                <td>
                    <div>${order.customer.name}</div>
                    <small style="color: var(--gray-500)">${order.customer.email}</small>
                </td>
                <td>${order.items.map(i => `${i.name} (${i.size})`).join(', ')}</td>
                <td>$${order.total}</td>
                <td><span class="status-badge ${order.status}">${order.status.toUpperCase()}</span></td>
                <td>${this.formatDate(order.createdAt)}</td>
                <td>
                    <select class="action-btn" onchange="Dashboard.updateOrderStatus('${order.id}', this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No orders found</td></tr>';
    },

    setupOrderFilters() {
        const filterSelect = document.getElementById('order-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                this.loadOrdersTable(filterSelect.value);
            });
        }
    },

    updateOrderStatus(orderId, status) {
        const orders = DataStore.get('orders') || [];
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            orders[idx].status = status;
            DataStore.set('orders', orders);
        }
    },

    editProduct(productId) {
        const products = DataStore.get('products') || [];
        const product = products.find(p => p.id === productId);
        if (product) {
            alert(`Edit product: ${product.name}\n(Product editing modal would open here)`);
        }
    },

    // =======================================================================
    // Settings Tab
    // =======================================================================

    loadSettings() {
        // Load current settings into forms
        const settings = DataStore.get('settings') || {};
        
        if (settings.stripePk) {
            document.getElementById('stripe-pk').value = settings.stripePk;
        }
        
        if (typeof AdminAuth !== 'undefined') {
            document.getElementById('admin-email-setting').value = AdminAuth.getCurrentUser() || '';
        }

        // Setup form handlers
        this.setupSettingsForms();
    },

    setupSettingsForms() {
        // Stripe settings form
        const stripeForm = document.getElementById('stripe-settings');
        if (stripeForm) {
            stripeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const settings = DataStore.get('settings') || {};
                settings.stripePk = document.getElementById('stripe-pk').value;
                // In production, sensitive keys would be stored server-side
                DataStore.set('settings', settings);
                alert('Stripe settings saved!');
            });
        }

        // Admin settings form
        const adminForm = document.getElementById('admin-settings');
        if (adminForm) {
            adminForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newEmail = document.getElementById('admin-email-setting').value;
                const currentPassword = document.getElementById('admin-current-password').value;
                const newPassword = document.getElementById('admin-new-password').value;

                if (typeof AdminAuth !== 'undefined') {
                    const result = await AdminAuth.updateCredentials(newEmail, currentPassword, newPassword);
                    if (result.success) {
                        alert('Account settings updated!');
                        this.updateUserInfo();
                    } else {
                        alert('Error: ' + result.error);
                    }
                }
            });
        }

        // Ticket settings form
        const ticketForm = document.getElementById('ticket-settings');
        if (ticketForm) {
            ticketForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const settings = DataStore.get('settings') || {};
                settings.emailConfirmation = document.getElementById('email-confirmation').checked;
                settings.smsConfirmation = document.getElementById('sms-confirmation').checked;
                settings.allowTransfer = document.getElementById('allow-transfer').checked;
                DataStore.set('settings', settings);
                alert('Ticket settings saved!');
            });
        }
    },

    // =======================================================================
    // Modals
    // =======================================================================

    setupModals() {
        // Add Event Modal
        this.setupEventModal();
        
        // Add Product Modal
        this.setupProductModal();
    },

    setupEventModal() {
        const addBtn = document.getElementById('add-event-btn');
        const modal = document.getElementById('add-event-modal');
        const closeBtn = document.getElementById('close-event-modal');
        const cancelBtn = document.getElementById('cancel-event');
        const form = document.getElementById('add-event-form');
        const addTierBtn = document.getElementById('add-tier-btn');

        if (addBtn && modal) {
            addBtn.addEventListener('click', () => modal.classList.add('active'));
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => modal.classList.remove('active'));
        }

        if (modal) {
            modal.querySelector('.modal-backdrop').addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (addTierBtn) {
            addTierBtn.addEventListener('click', () => this.addTicketTier());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.createEvent(e));
        }
    },

    addTicketTier() {
        const container = document.getElementById('ticket-tiers');
        const tierDiv = document.createElement('div');
        tierDiv.className = 'ticket-tier';
        tierDiv.innerHTML = `
            <div class="admin-form-row">
                <div class="admin-form-group">
                    <label>TIER NAME</label>
                    <input type="text" name="tier-name[]" placeholder="VIP Access" required>
                </div>
                <div class="admin-form-group">
                    <label>PRICE</label>
                    <input type="number" name="tier-price[]" placeholder="100" required>
                </div>
                <div class="admin-form-group">
                    <label>QUANTITY</label>
                    <input type="number" name="tier-qty[]" placeholder="50" required>
                </div>
            </div>
        `;
        container.appendChild(tierDiv);
    },

    createEvent(e) {
        e.preventDefault();
        
        const form = e.target;
        const events = DataStore.get('events') || [];
        
        const tierNames = form.querySelectorAll('[name="tier-name[]"]');
        const tierPrices = form.querySelectorAll('[name="tier-price[]"]');
        const tierQtys = form.querySelectorAll('[name="tier-qty[]"]');
        
        const tiers = [];
        tierNames.forEach((input, i) => {
            tiers.push({
                id: `tier_${Date.now()}_${i}`,
                name: input.value,
                price: parseInt(tierPrices[i].value),
                quantity: parseInt(tierQtys[i].value),
                sold: 0
            });
        });

        const newEvent = {
            id: `EVT${String(events.length + 1).padStart(3, '0')}`,
            name: document.getElementById('event-name').value,
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            venue: document.getElementById('event-venue').value,
            address: document.getElementById('event-address').value,
            tiers: tiers,
            active: true
        };

        events.push(newEvent);
        DataStore.set('events', events);
        
        document.getElementById('add-event-modal').classList.remove('active');
        form.reset();
        this.loadEventsList();
    },

    setupProductModal() {
        const addBtn = document.getElementById('add-product-btn');
        const modal = document.getElementById('add-product-modal');
        const closeBtn = document.getElementById('close-product-modal');
        const cancelBtn = document.getElementById('cancel-product');
        const form = document.getElementById('add-product-form');

        if (addBtn && modal) {
            addBtn.addEventListener('click', () => modal.classList.add('active'));
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => modal.classList.remove('active'));
        }

        if (modal) {
            modal.querySelector('.modal-backdrop').addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => this.createProduct(e));
        }
    },

    createProduct(e) {
        e.preventDefault();
        
        const form = e.target;
        const products = DataStore.get('products') || [];
        
        const sizeCheckboxes = form.querySelectorAll('[name="sizes[]"]:checked');
        const sizes = Array.from(sizeCheckboxes).map(cb => cb.value);

        const newProduct = {
            id: `PROD${String(products.length + 1).padStart(3, '0')}`,
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: parseInt(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            image: document.getElementById('product-image').value,
            sizes: sizes,
            category: 'tees',
            active: true
        };

        products.push(newProduct);
        DataStore.set('products', products);
        
        document.getElementById('add-product-modal').classList.remove('active');
        form.reset();
        this.loadProductsGrid();
    },

    // =======================================================================
    // Utilities
    // =======================================================================

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },

    formatEventDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => Dashboard.init());
