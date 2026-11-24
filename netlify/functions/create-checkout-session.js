// Server-side Stripe Checkout Form (Dahlia). Never place secret keys in browser code.
const Stripe = require('stripe');

const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  },
  body: JSON.stringify(payload)
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return { ...json(405, { error: 'Method not allowed.' }), headers: { 'Content-Type': 'application/json', Allow: 'GET, POST' } };
  }

  // Checkout is deliberately disabled until the site owner approves the booking
  // workflow and configures test keys plus a real Stripe deposit Price ID.
  const priceId = process.env.STRIPE_CHECKOUT_PRICE_ID || 'price_...';
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  const ready =
    process.env.STRIPE_CHECKOUT_ENABLED === 'true' &&
    /^price_[A-Za-z0-9]+$/.test(priceId) &&
    /^pk_(test|live)_/.test(publishableKey) &&
    /^sk_(test|live)_/.test(secretKey) &&
    publishableKey.split('_')[1] === secretKey.split('_')[1];

  if (!ready) {
    return json(503, { error: 'Checkout is not configured yet. Please contact Block Light Media.' });
  }

  if (event.httpMethod === 'GET') {
    // The publishable key is safe to send to the browser; the secret key is not.
    return json(200, { publishableKey });
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' });

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'form',
      mode: 'payment', // One-time booking deposit. Change only if selling subscriptions.
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: false },
      submit_type: 'auto',
      integration_identifier: 'custom_embedded_web_0001',
      line_items: [{ price: priceId, quantity: 1 }]
      // payment_method_collection: 'always' applies only to subscription mode.
    });

    return json(200, { client_secret: session.client_secret });
  } catch (error) {
    console.error('Stripe Checkout Session could not be created:', error.type || error.name);
    return json(502, { error: 'Unable to start checkout. Please contact Block Light Media.' });
  }
};
