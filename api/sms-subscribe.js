/**
 * SMS Subscription API Endpoint
 * 
 * This file provides example implementations for connecting to popular SMS services:
 * - Twilio
 * - Postscript
 * - Klaviyo
 * 
 * For production, deploy this as a serverless function (Vercel, Netlify Functions, etc.)
 * or as part of your Express/Node.js backend.
 */

// ============================================================================
// TWILIO INTEGRATION
// ============================================================================

const twilio = require('twilio');

// Initialize Twilio client
// Store these in environment variables!
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function subscribeWithTwilio(phone, email, metadata) {
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    
    try {
        // Option 1: Use Twilio's Notify API for bulk messaging
        // Option 2: Store in your database and use Twilio to send
        // Option 3: Use Twilio's Messaging Service with opt-in
        
        // Create a binding for the subscriber
        const binding = await twilioClient.notify.services(messagingServiceSid)
            .bindings
            .create({
                identity: email || phone,
                bindingType: 'sms',
                address: phone,
                tags: metadata.tags || ['blacklist']
            });
        
        // Send welcome message
        await twilioClient.messages.create({
            body: 'Welcome to LAST NIGHT. You\'re on the Blacklist. Early access codes drop 15 mins before public releases. -ZZZ',
            messagingServiceSid: messagingServiceSid,
            to: phone
        });
        
        return {
            success: true,
            subscriber_id: binding.sid,
            service: 'twilio'
        };
    } catch (error) {
        console.error('Twilio error:', error);
        throw error;
    }
}

// ============================================================================
// POSTSCRIPT INTEGRATION
// ============================================================================

async function subscribeWithPostscript(phone, email, metadata) {
    // Postscript API endpoint
    const POSTSCRIPT_API_URL = 'https://api.postscript.io/v1/subscribers';
    const POSTSCRIPT_API_KEY = process.env.POSTSCRIPT_API_KEY;
    const POSTSCRIPT_SHOP_ID = process.env.POSTSCRIPT_SHOP_ID;
    
    try {
        const response = await fetch(POSTSCRIPT_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${POSTSCRIPT_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone_number: phone,
                email: email,
                tags: metadata.tags || ['blacklist', 'early_access'],
                source: metadata.source || 'website',
                // Optional: Add to specific keyword/campaign
                keyword_id: process.env.POSTSCRIPT_KEYWORD_ID
            })
        });
        
        if (!response.ok) {
            throw new Error(`Postscript API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Send welcome message via Postscript
        await fetch('https://api.postscript.io/v1/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${POSTSCRIPT_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscriber_id: data.id,
                message: "Welcome to LAST NIGHT. You're on the Blacklist. Early access codes drop 15 mins before public releases. Reply STOP to unsubscribe.",
                shop_id: POSTSCRIPT_SHOP_ID
            })
        });
        
        return {
            success: true,
            subscriber_id: data.id,
            service: 'postscript'
        };
    } catch (error) {
        console.error('Postscript error:', error);
        throw error;
    }
}

// ============================================================================
// KLAVIYO INTEGRATION
// ============================================================================

async function subscribeWithKlaviyo(phone, email, metadata) {
    const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
    const KLAVIYO_LIST_ID = process.env.KLAVIYO_SMS_LIST_ID;
    
    try {
        // Create/update profile
        const profileResponse = await fetch('https://a.klaviyo.com/api/profile-import/', {
            method: 'POST',
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
                'Content-Type': 'application/json',
                'revision': '2023-02-22'
            },
            body: JSON.stringify({
                data: {
                    type: 'profile',
                    attributes: {
                        phone_number: phone,
                        email: email,
                        properties: {
                            source: metadata.source,
                            tags: metadata.tags?.join(', ')
                        }
                    }
                }
            })
        });
        
        if (!profileResponse.ok) {
            throw new Error(`Klaviyo API error: ${profileResponse.statusText}`);
        }
        
        const profile = await profileResponse.json();
        
        // Add to SMS list
        await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`, {
            method: 'POST',
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
                'Content-Type': 'application/json',
                'revision': '2023-02-22'
            },
            body: JSON.stringify({
                data: [{
                    type: 'profile',
                    id: profile.data.id
                }]
            })
        });
        
        return {
            success: true,
            subscriber_id: profile.data.id,
            service: 'klaviyo'
        };
    } catch (error) {
        console.error('Klaviyo error:', error);
        throw error;
    }
}

// ============================================================================
// MAIN HANDLER (Express/Vercel/Netlify)
// ============================================================================

module.exports = async function handler(req, res) {
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
    
    const { phone, email, list, source, tags } = req.body;
    
    // Validate phone number
    if (!phone || phone.replace(/\D/g, '').length < 10) {
        return res.status(400).json({ error: 'Valid phone number required' });
    }
    
    // Get SMS service from environment variable
    const service = process.env.SMS_SERVICE || 'twilio';
    
    try {
        let result;
        
        switch (service) {
            case 'twilio':
                result = await subscribeWithTwilio(phone, email, { list, source, tags });
                break;
            case 'postscript':
                result = await subscribeWithPostscript(phone, email, { list, source, tags });
                break;
            case 'klaviyo':
                result = await subscribeWithKlaviyo(phone, email, { list, source, tags });
                break;
            default:
                throw new Error('Unknown SMS service');
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ 
            error: 'Failed to subscribe',
            message: error.message 
        });
    }
};

// ============================================================================
// EXPRESS.JS SETUP EXAMPLE
// ============================================================================
/*
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/sms/subscribe', require('./sms-subscribe'));

app.listen(3000, () => {
    console.log('SMS API running on port 3000');
});
*/

// ============================================================================
// ENVIRONMENT VARIABLES NEEDED
// ============================================================================
/*
# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_MESSAGING_SERVICE_SID=your_messaging_service_sid

# Postscript
POSTSCRIPT_API_KEY=your_api_key
POSTSCRIPT_SHOP_ID=your_shop_id
POSTSCRIPT_KEYWORD_ID=your_keyword_id

# Klaviyo
KLAVIYO_PRIVATE_API_KEY=your_private_api_key
KLAVIYO_SMS_LIST_ID=your_list_id

# General
SMS_SERVICE=twilio|postscript|klaviyo
*/
