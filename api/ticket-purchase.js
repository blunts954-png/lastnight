/**
 * LAST NIGHT - Ticket Purchase API
 * 
 * This is a serverless function for processing ticket purchases via Stripe.
 * Deploy to Vercel, Netlify, or any Node.js serverless platform.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key (sk_live_... or sk_test_...)
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret (whsec_...)
 * - BASE_URL: Your website URL for redirect
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Ticket pricing (should match frontend)
const TICKET_PRICES = {
    ga: {
        name: 'General Admission',
        price: 4500, // $45.00 in cents
        fee: 500     // $5.00 service fee
    },
    vip: {
        name: 'VIP Access',
        price: 9500,
        fee: 1000
    },
    table: {
        name: 'Table Service',
        price: 50000,
        fee: 2500
    }
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { tier, quantity, customer, eventId } = req.body;

        // Validate request
        if (!tier || !TICKET_PRICES[tier]) {
            return res.status(400).json({ error: 'Invalid ticket tier' });
        }

        if (!quantity || quantity < 1 || quantity > 10) {
            return res.status(400).json({ error: 'Invalid quantity (1-10 allowed)' });
        }

        if (!customer || !customer.email || !customer.name) {
            return res.status(400).json({ error: 'Customer information required' });
        }

        const ticketType = TICKET_PRICES[tier];
        const subtotal = ticketType.price * quantity;
        const fees = ticketType.fee * quantity;
        const total = subtotal + fees;

        // Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                eventId: eventId || 'EVT001',
                tier: tier,
                tierName: ticketType.name,
                quantity: quantity.toString(),
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone || ''
            },
            receipt_email: customer.email,
            description: `LAST NIGHT Event - ${ticketType.name} x${quantity}`
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: total,
            breakdown: {
                subtotal: subtotal,
                fees: fees,
                total: total
            }
        });

    } catch (error) {
        console.error('Ticket purchase error:', error);
        res.status(500).json({ 
            error: 'Payment processing failed',
            message: error.message 
        });
    }
};

/**
 * For local testing without Stripe, you can use this mock handler:
 * 
 * module.exports = async (req, res) => {
 *     res.setHeader('Access-Control-Allow-Origin', '*');
 *     
 *     if (req.method === 'OPTIONS') return res.status(200).end();
 *     
 *     const { tier, quantity } = req.body;
 *     const mockTicketId = `LN-TICKET-${Date.now().toString(36).toUpperCase()}`;
 *     
 *     res.status(200).json({
 *         success: true,
 *         ticketId: mockTicketId,
 *         message: 'Mock payment successful'
 *     });
 * };
 */
