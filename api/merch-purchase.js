/**
 * LAST NIGHT - Merch Purchase API
 * 
 * Serverless function for processing merchandise orders via Stripe.
 * Deploy to Vercel, Netlify, or any Node.js serverless platform.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Shipping rates
const SHIPPING_RATES = {
    standard: 1000,  // $10.00
    express: 2500,   // $25.00
    free_threshold: 15000  // Free shipping over $150
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
        const { items, customer, shipping } = req.body;

        // Validate request
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'No items in cart' });
        }

        if (!customer || !customer.email || !customer.name) {
            return res.status(400).json({ error: 'Customer information required' });
        }

        if (!shipping || !shipping.address) {
            return res.status(400).json({ error: 'Shipping address required' });
        }

        // Calculate totals
        let subtotal = 0;
        const lineItems = items.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            return {
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                total: itemTotal
            };
        });

        // Calculate shipping
        const shippingCost = subtotal >= SHIPPING_RATES.free_threshold 
            ? 0 
            : SHIPPING_RATES.standard;

        const total = subtotal + shippingCost;

        // Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                orderType: 'merch',
                itemCount: items.length.toString(),
                customerName: customer.name,
                customerEmail: customer.email,
                shippingAddress: JSON.stringify(shipping.address).substring(0, 500)
            },
            receipt_email: customer.email,
            description: `LAST NIGHT Merch Order - ${items.length} item(s)`,
            shipping: {
                name: customer.name,
                address: {
                    line1: shipping.address.line1,
                    line2: shipping.address.line2 || '',
                    city: shipping.address.city,
                    state: shipping.address.state,
                    postal_code: shipping.address.postal_code,
                    country: shipping.address.country || 'US'
                }
            }
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: total,
            breakdown: {
                subtotal: subtotal,
                shipping: shippingCost,
                total: total
            },
            items: lineItems
        });

    } catch (error) {
        console.error('Merch purchase error:', error);
        res.status(500).json({ 
            error: 'Payment processing failed',
            message: error.message 
        });
    }
};
