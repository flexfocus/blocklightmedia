/* Client-side Checkout Form. Never store a Stripe secret key in this file. */
(async () => {
  'use strict';

  const status = document.getElementById('checkout-status');
  const endpoint = '/.netlify/functions/create-checkout-session';
  if (!status) return;

  try {
    if (typeof Stripe !== 'function') {
      throw new Error('Stripe.js did not load.');
    }

    const configResponse = await fetch(endpoint, { method: 'GET', cache: 'no-store' });
    const config = await configResponse.json();
    if (!configResponse.ok || !config.publishableKey) {
      throw new Error(config.error || 'Checkout is not ready.');
    }

    const stripe = Stripe(config.publishableKey);
    const appearance = {
      theme: 'stripe',
      labels: 'auto',
      inputs: 'spaced',
      variables: {
        borderRadius: '4px',
        colorBackground: '#ffffff',
        colorDanger: '#df1b41',
        colorPrimary: '#0570de',
        colorSuccess: '#00c853',
        colorText: '#30313d',
        fontFamily: 'default',
        fontSizeBase: '16px',
        spacingUnit: '4px'
      }
    };

    // The server owns the amount and Stripe Price ID; browser input cannot change them.
    const clientSecret = fetch(endpoint, { method: 'POST' })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok || !body.client_secret) {
          throw new Error(body.error || 'Unable to start checkout.');
        }
        return body.client_secret;
      });

    const checkout = stripe.initCheckoutFormSdk({ clientSecret, appearance });
    const form = checkout.createForm({ layout: 'expanded' });
    form.mount('#checkout-form');

    const loadActionsResult = await checkout.loadActions();
    if (loadActionsResult.type !== 'success') {
      throw new Error('The payment form could not be loaded.');
    }

    status.hidden = true;
    form.on('confirm', async (event) => {
      try {
        const result = await loadActionsResult.actions.confirm({ formConfirmEvent: event });
        if (result && result.type === 'error') {
          status.textContent = result.error?.message || 'Payment was not completed. Please try again.';
          status.hidden = false;
        }
      } catch (error) {
        status.textContent = 'Payment was not completed. Please try again or contact us.';
        status.hidden = false;
        console.error('Checkout confirmation failed:', error);
      }
    });
  } catch (error) {
    status.textContent = error.message || 'Checkout is unavailable. Please contact Block Light Media.';
    status.hidden = false;
    console.error('Checkout setup failed:', error);
  }
})();
