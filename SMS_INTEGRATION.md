# LAST NIGHT - SMS Integration Guide

This document outlines the SMS service integration for the Blacklist (early access) signup form.

## Changes Made

### 1. Product Photos (Instagram Images)
Replaced SVG placeholders with real Instagram images from @last_night_zzz:

| Product | Image URL |
|---------|-----------|
| Product 1 (Aftermath Hoodie) | Event poster from Instagram |
| Product 2 (ZZZ Cargo Pants) | Event poster from Instagram |
| Product 3 (Dawn Tee) | Event poster from Instagram |
| Community 1 | @nxghtshift - Tokyo |
| Community 2 | @voidwalker.exe - Berlin |
| Community 3 | @sleepless.404 - NYC |
| Community 4 | @afterhours.club - London |
| Community 5 | @the.crash - LA |
| Community 6 | @static.dreamer - Seoul |

**Note:** The Instagram account (@last_night_zzz) is for a party/event service, not a clothing brand. The images used are event flyers and promotional materials. For actual streetwear product photos, you'll need to replace these URLs with your own product photography.

### 2. Hero Video Setup
The hero video container is configured with:
- Placeholder for 10-15 second loop video
- Poster image from Instagram as fallback
- Shaky cam aesthetic recommended

To add your video:
1. Place your `hero-video.mp4` file in the `assets/` folder
2. Or update the `<source>` tag with a CDN/Instagram video URL

### 3. SMS Service Integration

The Blacklist form now supports three SMS services:

#### Supported Services
- **Twilio** - Best for custom SMS workflows
- **Postscript** - E-commerce focused (Shopify integration)
- **Klaviyo** - Marketing automation with SMS

## Setup Instructions

### Step 1: Choose Your SMS Service

Edit `script.js` and set your preferred service:

```javascript
const SMS_CONFIG = {
    service: 'twilio', // Change to: 'twilio', 'postscript', or 'klaviyo'
    // ...
};
```

### Step 2: Backend Setup

The frontend requires a backend proxy to protect API keys. See `api/sms-subscribe.js` for example implementations.

#### Option A: Vercel Serverless Function

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Create `api/sms-subscribe.js` (already included)

3. Create `vercel.json`:
```json
{
  "functions": {
    "api/sms-subscribe.js": {
      "maxDuration": 10
    }
  }
}
```

4. Set environment variables in Vercel dashboard

5. Deploy:
```bash
vercel
```

#### Option B: Netlify Functions

1. Rename `api/sms-subscribe.js` to `netlify/functions/sms-subscribe.js`

2. Wrap the handler:
```javascript
exports.handler = async (event, context) => {
    // Parse the event body
    event.body = JSON.parse(event.body);
    
    // Create mock res object
    let response = {};
    const res = {
        setHeader: () => {},
        status: (code) => {
            response.statusCode = code;
            return res;
        },
        json: (data) => {
            response.body = JSON.stringify(data);
            return response;
        }
    };
    
    return await handler(event, res);
};
```

#### Option C: Express.js Backend

```javascript
const express = require('express');
const smsSubscribe = require('./api/sms-subscribe');

const app = express();
app.use(express.json());

app.post('/api/sms/subscribe', async (req, res) => {
    await smsSubscribe(req, res);
});

app.listen(3000);
```

### Step 3: Environment Variables

Create a `.env` file (never commit this to git):

#### For Twilio:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMS_SERVICE=twilio
```

#### For Postscript:
```
POSTSCRIPT_API_KEY=your_api_key
POSTSCRIPT_SHOP_ID=your_shop_id
POSTSCRIPT_KEYWORD_ID=your_keyword_id
SMS_SERVICE=postscript
```

#### For Klaviyo:
```
KLAVIYO_PRIVATE_API_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
KLAVIYO_SMS_LIST_ID=XXXXXX
SMS_SERVICE=klaviyo
```

### Step 4: Update Frontend API Endpoint

In `script.js`, update the API endpoint:

```javascript
const SMS_CONFIG = {
    service: 'twilio',
    apiEndpoints: {
        twilio: 'https://your-api.com/api/sms/subscribe',
        postscript: 'https://your-api.com/api/sms/subscribe',
        klaviyo: 'https://your-api.com/api/sms/subscribe'
    }
};
```

### Step 5: Compliance

Ensure you comply with SMS regulations:

1. **TCPA Compliance (US):**
   - Include "Reply STOP to unsubscribe" in welcome message
   - Only send between 8 AM - 9 PM local time
   - Maintain opt-in records

2. **CTIA Guidelines:**
   - Clear terms and conditions
   - Message frequency disclosure
   - Help/support contact info

3. **Form Updates (Already Done):**
   - Privacy note: "Your info stays with us. We don't sell data. Ever."
   - Clear value proposition: "Get early access codes via SMS 15 minutes before public drops"

## Testing

### Local Development

The form includes a mock mode for development. When no backend is configured, it will log to console:

```
📱 SMS Subscription: {
  phone: "+15550001234",
  email: "user@example.com",
  service: "twilio",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

### Production Testing

1. Deploy your backend API
2. Update the frontend endpoint URL
3. Test with your own phone number
4. Verify welcome SMS is received
5. Test STOP/opt-out functionality

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Ensure backend sends `Access-Control-Allow-Origin` header |
| API key errors | Check environment variables are set correctly |
| SMS not sending | Verify phone number format (E.164: +1234567890) |
| Twilio errors | Check Twilio Console for error logs |
| Postscript errors | Verify shop is on paid plan |
| Rate limiting | Implement retry logic in frontend |

## Cost Estimation

| Service | Cost per SMS | Monthly Estimate (1000 subs) |
|---------|--------------|------------------------------|
| Twilio | ~$0.0075 | ~$15-30 |
| Postscript | $0.015-0.025 | ~$50-100 |
| Klaviyo | $0.015-0.025 | ~$50-100 |

*Prices vary by volume and destination country

## Security Notes

1. **Never expose API keys in frontend code**
2. **Validate phone numbers on backend**
3. **Rate limit API endpoints**
4. **Use HTTPS only**
5. **Store subscriber data securely**
6. **Implement webhook verification**

## Next Steps

1. Set up your backend API
2. Configure environment variables
3. Deploy and test
4. Set up SMS campaigns for product drops
5. Monitor delivery rates and engagement

For questions, refer to:
- [Twilio SMS Docs](https://www.twilio.com/docs/sms)
- [Postscript API Docs](https://docs.postscript.io/)
- [Klaviyo SMS Docs](https://developers.klaviyo.com/)
