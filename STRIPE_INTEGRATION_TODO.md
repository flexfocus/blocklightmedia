# Stripe Checkout Form Integration — Setup TODO

**Status:** Draft integration code only. Payments are **OFF** until configured in Netlify. No charge, website-wide booking button, webhook fulfillment, or automatic client-gallery unlock has been activated.

**Single source of truth for setup and launch checks.** The site is static HTML/CSS/JS deployed by Netlify, so its server endpoint uses a Netlify Function.

## Values to Replace

The following values are placeholders or runtime configuration and must be updated before testing or going live.

**Files containing placeholders/configurable values:**
- [netlify/functions/create-checkout-session.js](netlify/functions/create-checkout-session.js)
- [checkout.js](checkout.js) — retrieves the public publishable key; no secrets live in the browser.
- [package.json](package.json) — Stripe Node SDK dependency.

| Field | Current value | What to set |
| --- | --- | --- |
| `mode` (sample_only) | `payment` | Correct for one-time deposits; change to `subscription` only for a recurring product and then include `payment_method_collection: 'always'`. |
| `line_items[0].price` (sample_only) | Fallback `price_...` | Set `STRIPE_CHECKOUT_PRICE_ID` to an **approved, one-time deposit Price ID** from Stripe. The server refuses to run using the placeholder. Example: the approved Individual Basketball Photography $100 deposit Price ID; verify price in Stripe first. |
| `STRIPE_PUBLISHABLE_KEY` | Not configured in source | Set in Netlify environment variables to `pk_test_...` for testing; use matching `pk_live_...` only at launch. The GET handler exposes this public key, which is intentional. |
| `STRIPE_SECRET_KEY` | Not configured in source | Set in Netlify environment variables to `sk_test_...` for testing; use matching `sk_live_...` only at launch. **Never commit or share the secret key.** |
| `STRIPE_CHECKOUT_ENABLED` | Absent / disabled | Keep off until test-mode review, date-approval process and tax/terms sign-off. Set to `true` in Netlify only when deliberately testing or deploying. **Never enable with live keys before verifying the conditions below.** |

There is no `.env` file in this repository; for production set those four exact names in **Netlify → Site configuration → Environment variables**. For local Netlify CLI development, set them in your local ignored `.env` file or a private shell. Browser code doesn't reference `STRIPE_SECRET_KEY`. **Do not create a `VITE_` key**; this site does not use Vite.

### Existing Stripe prices

Stripe prices and payment links created in your Dashboard are not automatically imported. You must copy a real **Price ID** (starts with `price_`) for the approved deposit, **not** a Payment Link URL or a Product ID (`prod_`). Be sure the Stripe price amount agrees with the written booking terms. Any later change to another package requires a deliberate server-side price mapping; don't accept prices or Price IDs supplied by the browser.

## Configured Parameters

**Files containing these parameters:**
- [netlify/functions/create-checkout-session.js](netlify/functions/create-checkout-session.js)
- [checkout.js](checkout.js) (Dahlia Checkout Form SDK and appearance)

| Checkout Session parameter | Value |
| --- | --- |
| `ui_mode` | `form` |
| `mode` | `payment` (one-time; sample-only choice) |
| `billing_address_collection` | `auto` |
| `phone_number_collection` | `{ enabled: false }` |
| `automatic_tax` | `{ enabled: false }` |
| `submit_type` | `auto` |
| `integration_identifier` | `custom_embedded_web_0001` |
| `line_items` | `[{ price: STRIPE_CHECKOUT_PRICE_ID || 'price_...', quantity: 1 }]` |
| `payment_method_collection` | **Omitted for `mode: 'payment'`** as required; Stripe's `always` setting only applies for subscription mode. |
| Stripe server API version | `2026-03-25.dahlia` |
| Stripe.js script | `https://js.stripe.com/dahlia/stripe.js` |
| Checkout form style | Stripe default theme with the supplied Checkout Studio spacing/colors |

The server SDK is `stripe@^22.0.0`, compatible with the Dahlia API. The Stripe Checkout Form SDK might require Stripe account access/eligibility to this integration; test your account before going live.

## Setup and next steps

1. **Review booking rules first:** Confirm exact service, date, location, coverage, deliverables, cancellation/refund terms, payment schedule, travel and any additional charges **before inviting a payment**. A Stripe checkout by itself does not reserve a date.
2. In Stripe **test mode**, open the Product Catalog, identify the **specific approved deposit price** (e.g. Individual Basketball Photography, $100), and copy its `price_...` ID. Do not confuse the total price with the deposit price.
3. In Netlify's environment settings, add `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_CHECKOUT_PRICE_ID`, and `STRIPE_CHECKOUT_ENABLED`. Start with matching **test** keys and a **test-mode** Price ID, and set enabled to `true` only while intentionally testing. Redeploy to apply the configuration.
4. Open `/checkout.html` on your Netlify preview deployment to test the **embedded** checkout. It is a standalone, **unlinked, noindex** page (not a booking link; no login or approval is built in).
5. Run a Stripe test payment. Standard successful test card: `4242 4242 4242 4242`; choose any valid future expiry, any CVC and a ZIP code if requested. Test at least a declined card and one additional supported method, and make sure the amount is the intended deposit, not the full package.
6. Inspect the test Checkout Session and payment in Stripe Dashboard. Confirm the correct test mode, Price ID, total, and customer data. **Do not use a browser success state alone as payment verification.**
7. For real bookings, agree on the scope and terms with the client first; then turn on live checkout only after an authorized booking flow is in place. Presently anyone who knows the page URL could start a charge once enabled. Don't link it publicly until authorization rules exist.
8. **Important: tax is disabled in this Checkout Studio configuration.** Review Pennsylvania sales tax obligations, registration and correct tax handling before charging customers; enabling Stripe Tax later is a separate decision and code/configuration change.
9. Add Stripe **webhook signature verification**, verified payment status tracking, customer-to-booking matching, paid/unpaid order records, and customer-specific final balance billing before treating this as an automated delivery workflow. None of these are implemented. In particular, **this does not yet unlock or protect client photos/videos**.
10. For final balances, continue using **customer-specific Stripe invoices** after reconciling the deposit rather than pretending this generic single-price checkout knows what each customer owes.
11. After all tests and business rules are approved, replace test credentials with live credentials **in Netlify only**, configure a matching live Price ID, and perform an authorized low-value end-to-end test before sending to customers.

## Project structure and flow

| File | Purpose |
| --- | --- |
| [package.json](package.json) | Installs the Stripe server Node.js SDK during the Netlify build. |
| [netlify/functions/create-checkout-session.js](netlify/functions/create-checkout-session.js) | GET returns public publishable key when ready; POST creates a one-time `ui_mode: 'form'` Stripe Checkout Session and returns `client_secret`. Prices and secrets are controlled on the server. |
| [checkout.html](checkout.html) | Unlinked, noindex HTML preview with a `#checkout-form` mount point and Stripe's official Dahlia script. |
| [checkout.js](checkout.js) | Reads public key, requests a Session secret from the Netlify Function, initializes `initCheckoutFormSdk`, mounts the form, and handles confirmation. |
| [netlify.toml](netlify.toml) | Explicit Netlify function directory and source-file access restrictions. |

**Payment flow:** approved booking terms outside this page → owner provides direct checkout page when ready → browser requests a publishable key → browser requests a Checkout Session → server creates session using a configured fixed Price ID → Stripe secure iframe renders → customer confirms payment → Stripe records payment. **Owner must verify the payment in Stripe**; no automated fulfillment exists.

### Restrictions and test status

- **No live test was performed.** This draft has no user-provided Stripe API keys or real Price ID.
- Not connected to website booking cards, client accounts, Netlify Forms, photo/video galleries, or post-payment delivery.
- The existing `project-inquiry` Netlify contact form is unchanged.
- The Stripe Checkout Form SDK is a distinct embed from hosted Checkout and classic Embedded Checkout; do not interchange `ui_mode` and Stripe.js initialization patterns.

## Resources

- Stripe keys and security: https://docs.stripe.com/keys-best-practices
- Stripe payment testing: https://docs.stripe.com/testing
- Stripe Checkout: https://docs.stripe.com/payments/checkout
- Stripe integration support: https://support.stripe.com
- Stripe MCP: https://docs.stripe.com/mcp
- Netlify Functions: https://docs.netlify.com/build/functions/overview/
