/**
 * LAST NIGHT - Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for:
 * - Payment confirmation
 * - Ticket generation and email delivery
 * - Order fulfillment triggers
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret (whsec_...)
 * - SENDGRID_API_KEY: (optional) For sending confirmation emails
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

// Generate unique ticket ID - includes event ID, timestamp, and random bytes
// Format: EVENTID-TIMESTAMP-RANDOMHEX for unique, event-specific tickets
function generateTicketId(eventId = 'EVT001') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomHex = crypto.randomBytes(8).toString('hex').toUpperCase();
    return `${eventId}-${timestamp}-${randomHex}`;
}

// Create QR payload with hash verification (matches frontend format)
function createQRPayload(ticketId, eventId) {
    const payload = {
        t: ticketId,           // ticket ID
        e: eventId,            // event ID this ticket is bound to
        v: 1,                  // version for future compatibility
        ts: Date.now()         // timestamp for additional uniqueness
    };
    
    // Create verification hash to prevent tampering
    const hashData = `${payload.t}:${payload.e}:${payload.ts}`;
    payload.h = crypto.createHash('sha256').update(hashData).digest('hex').substring(0, 12);
    
    return JSON.stringify(payload);
}

// Generate unique order ID
function generateOrderId() {
    return `LN-ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSuccess(event.data.object);
            break;
        
        case 'payment_intent.payment_failed':
            await handlePaymentFailure(event.data.object);
            break;
        
        case 'charge.refunded':
            await handleRefund(event.data.object);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
};

async function handlePaymentSuccess(paymentIntent) {
    const metadata = paymentIntent.metadata;
    
    if (metadata.tier) {
        // This is a ticket purchase
        await processTicketPurchase(paymentIntent);
    } else if (metadata.orderType === 'merch') {
        // This is a merch order
        await processMerchOrder(paymentIntent);
    }
}

async function processTicketPurchase(paymentIntent) {
    const metadata = paymentIntent.metadata;
    const quantity = parseInt(metadata.quantity) || 1;
    const eventId = metadata.eventId || 'EVT001';
    const tickets = [];

    // Generate unique tickets - each with its own unique ID bound to this specific event
    for (let i = 0; i < quantity; i++) {
        const ticketId = generateTicketId(eventId);
        const qrPayload = createQRPayload(ticketId, eventId);
        
        const ticket = {
            id: ticketId,
            eventId: eventId,
            qrPayload: qrPayload,  // Full QR data with verification hash
            tier: metadata.tier,
            tierName: metadata.tierName,
            customer: {
                name: metadata.customerName,
                email: metadata.customerEmail,
                phone: metadata.customerPhone
            },
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / quantity,
            status: 'valid',
            used: false,
            usedAt: null,
            createdAt: new Date().toISOString()
        };
        tickets.push(ticket);
    }

    // In production, save tickets to database
    console.log('Generated tickets:', tickets);

    // Send confirmation email with QR codes
    // await sendTicketConfirmationEmail(metadata.customerEmail, tickets);

    return tickets;
}

async function processMerchOrder(paymentIntent) {
    const metadata = paymentIntent.metadata;
    
    const order = {
        id: generateOrderId(),
        customer: {
            name: metadata.customerName,
            email: metadata.customerEmail
        },
        shippingAddress: JSON.parse(metadata.shippingAddress || '{}'),
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // In production, save order to database
    console.log('Created order:', order);

    // Send confirmation email
    // await sendOrderConfirmationEmail(metadata.customerEmail, order);

    return order;
}

async function handlePaymentFailure(paymentIntent) {
    const metadata = paymentIntent.metadata;
    console.log('Payment failed for:', metadata.customerEmail);
    
    // Could send a payment failed notification
    // await sendPaymentFailedEmail(metadata.customerEmail);
}

async function handleRefund(charge) {
    console.log('Refund processed:', charge.id);
    
    // Update ticket/order status to refunded
    // In production, update database records
}

/**
 * Example email sending function (requires SendGrid or similar)
 * 
 * async function sendTicketConfirmationEmail(email, tickets) {
 *     const sgMail = require('@sendgrid/mail');
 *     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 *     
 *     const msg = {
 *         to: email,
 *         from: 'tickets@lastnight.com',
 *         subject: 'Your LAST NIGHT Tickets',
 *         html: `<h1>Your tickets are confirmed!</h1>...`
 *     };
 *     
 *     await sgMail.send(msg);
 * }
 */
