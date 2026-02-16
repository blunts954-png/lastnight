/* ==========================================================================
   LAST NIGHT - Admin Authentication
   ========================================================================== */

// Configuration - In production, these would be verified server-side
const ADMIN_CONFIG = {
    // Default admin credentials (CHANGE THESE IN PRODUCTION!)
    // In a real app, this would be handled by a backend
    defaultEmail: 'admin@lastnight.com',
    defaultPassword: 'lastnightadmin2024',
    sessionKey: 'ln_admin_session',
    sessionExpiry: 24 * 60 * 60 * 1000 // 24 hours
};

// ==========================================================================
// Session Management
// ==========================================================================

const AdminSession = {
    create(email) {
        const session = {
            email: email,
            timestamp: Date.now(),
            expiry: Date.now() + ADMIN_CONFIG.sessionExpiry
        };
        localStorage.setItem(ADMIN_CONFIG.sessionKey, JSON.stringify(session));
        return session;
    },

    get() {
        const sessionData = localStorage.getItem(ADMIN_CONFIG.sessionKey);
        if (!sessionData) return null;
        
        try {
            const session = JSON.parse(sessionData);
            if (Date.now() > session.expiry) {
                this.destroy();
                return null;
            }
            return session;
        } catch (e) {
            this.destroy();
            return null;
        }
    },

    destroy() {
        localStorage.removeItem(ADMIN_CONFIG.sessionKey);
    },

    isValid() {
        return this.get() !== null;
    }
};

// ==========================================================================
// Authentication
// ==========================================================================

const AdminAuth = {
    // In production, this would call a secure backend API
    async login(email, password) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check credentials (in production, this is done server-side)
        // For demo purposes, we also check localStorage for custom admin creds
        const customCreds = localStorage.getItem('ln_admin_credentials');
        let validEmail = ADMIN_CONFIG.defaultEmail;
        let validPassword = ADMIN_CONFIG.defaultPassword;
        
        if (customCreds) {
            try {
                const parsed = JSON.parse(customCreds);
                validEmail = parsed.email || validEmail;
                validPassword = parsed.password || validPassword;
            } catch (e) {}
        }
        
        if (email === validEmail && password === validPassword) {
            AdminSession.create(email);
            return { success: true };
        }
        
        return { 
            success: false, 
            error: 'Invalid email or password' 
        };
    },

    logout() {
        AdminSession.destroy();
        window.location.href = 'admin-login.html';
    },

    requireAuth() {
        if (!AdminSession.isValid()) {
            window.location.href = 'admin-login.html';
            return false;
        }
        return true;
    },

    getCurrentUser() {
        const session = AdminSession.get();
        return session ? session.email : null;
    },

    // Update admin credentials (for settings page)
    async updateCredentials(newEmail, currentPassword, newPassword) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const currentUser = this.getCurrentUser();
        const customCreds = localStorage.getItem('ln_admin_credentials');
        let validPassword = ADMIN_CONFIG.defaultPassword;
        
        if (customCreds) {
            try {
                const parsed = JSON.parse(customCreds);
                validPassword = parsed.password || validPassword;
            } catch (e) {}
        }
        
        if (currentPassword !== validPassword) {
            return { success: false, error: 'Current password is incorrect' };
        }
        
        const newCreds = {
            email: newEmail || currentUser,
            password: newPassword || validPassword
        };
        
        localStorage.setItem('ln_admin_credentials', JSON.stringify(newCreds));
        
        // Update session with new email
        if (newEmail) {
            AdminSession.create(newEmail);
        }
        
        return { success: true };
    }
};

// ==========================================================================
// Login Page Handler
// ==========================================================================

function initLoginPage() {
    // If already logged in, redirect to dashboard
    if (AdminSession.isValid()) {
        window.location.href = 'admin-dashboard.html';
        return;
    }

    const form = document.getElementById('admin-login-form');
    const errorDiv = document.getElementById('admin-error');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('admin-password').value;
        
        // Show loading state
        submitBtn.classList.add('loading');
        errorDiv.style.display = 'none';
        
        try {
            const result = await AdminAuth.login(email, password);
            
            if (result.success) {
                window.location.href = 'admin-dashboard.html';
            } else {
                errorDiv.querySelector('.error-message').textContent = result.error;
                errorDiv.style.display = 'flex';
                submitBtn.classList.remove('loading');
            }
        } catch (error) {
            errorDiv.querySelector('.error-message').textContent = 'An error occurred. Please try again.';
            errorDiv.style.display = 'flex';
            submitBtn.classList.remove('loading');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initLoginPage);
