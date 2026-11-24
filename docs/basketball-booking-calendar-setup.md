# Basketball booking calendar — TidyCal Free setup

Status: **DRAFT ONLY**. This proposed site page contains no made-up availability or live deposit collection until verified TidyCal URLs are configured. Calendly Free does not support Stripe bookings. Leave existing live booking and Sweet 16 buttons unchanged.

## Packages (50% booking payment)

| TidyCal Booking type | Package total | Set TidyCal "Per booking" price to | Collect remaining separately |
| --- | ---: | ---: | ---: |
| Player Game Photos | $200 | $100 | $100 |
| Team Game Photos | $300 | $150 | $150 |
| Player Highlight Video | $300 | $150 | $150 |
| Team Highlight Video | $400 | $200 | $200 |

**TidyCal does NOT offer native partial-payment/deposit accounting.** Charge the deposit figure as the booking's entire up-front TidyCal price, clearly explain that it is a 50% booking deposit toward the full service cost, and invoice the remaining balance later. Do not present this as TidyCal automatically tracking the unpaid remainder.

## Free-plan features

- Unlimited booking types, one synced calendar, custom intake questions, a website embed, and paid bookings through Stripe or PayPal.
- Free-plan Stripe bookings incur TidyCal's **1% platform fee** in addition to Stripe processing, normally paid by the client as an added fee on the checkout. Confirm that total is acceptable to customers.
- TidyCal Free displays TidyCal branding in the embed.
- Verify tax collection obligations and a written cancellation/refund policy before inviting live bookings.

## Setup

1. Create an account on https://tidycal.com/pricing using Free. Under Integrations → Calendars connect your actual working calendar for conflict checks and bookings. Check the calendar is set to mark busy events Busy, not Free.
2. Integrations → Payments: connect the existing Block Light Media Stripe account through TidyCal. Make sure the expected account is connected.
3. Create **four booking types**, one per package, set to individual, not group bookings. Use 150 minutes as an initial game-length slot plus realistic buffers and travel constraints. The current draft only *displays* that duration until the actual scheduler is connected. Basketball clients may need to select the tipoff and details instead of an arbitrary office-hour slot; tailor availability accordingly.
4. For each booking type, choose Pricing & Subscriptions → **Per booking** → Stripe → USD price **equal to the deposit** from the table. Name/description must state package total, booking deposit, and remaining balance outside TidyCal; e.g. "Player Game Photos — $200 package, $100 charged at booking, $100 due before delivery".
5. Add required intake questions: game date and tipoff, team/athlete and jersey number (if relevant), opponent, gym/venue and full address, requested deliverables, permission to film. Ask a customer to acknowledge your terms and refund policy.
6. Configure genuine game-day availability, travel buffers, and blocked dates. Beware weekday 9–5 default schedules and overlapping bookings.
7. In TidyCal Booking types → three-dot menu → **Embed on website**, copy the individual URL for each type. Put the four real URLs in `basketball-booking.js` `BOOKING_LINKS` (example: https://tidycal.com/account/player-game-photos). Only exact HTTPS tidycal.com links are allowed. The website embeds TidyCal via its official script `https://asset-tidycal.b-cdn.net/js/embed.js`.
8. Verify a booking with a payment for each type, including correct date/time zone, deposit and fee totals, Stripe payment status, confirmation, and no double-booked slot. Confirm cancellation and payment refund workflows.
9. Once fully tested, consider removing `noindex,nofollow`, linking the basketball CTAs to `/basketball-booking.html`, and merging/deploying this PR.

The booking page deliberately keeps a "Request Game Availability" fallback until the links are configured and checked. Avoid sending a separate Stripe payment link after a TidyCal paid booking or you risk double-charging.

## Staged booking URLs (unverified)

These four user-provided URLs are wired to the package selector in a draft branch. Their public booking pages and actual payment configurations could not be verified from public sources; **do not enable public booking calls-to-action until tested**.

| Package | URL | Expected booking payment |
| --- | --- | ---: |
| Player Game Photos | https://tidycal.com/felixdlr4/player-game-photos | $100 |
| Team Game Photos | https://tidycal.com/felixdlr4/team-game-photography | $150 |
| Player Highlight Video | https://tidycal.com/felixdlr4/player-highlight-video | $150 |
| Team Highlight Video | https://tidycal.com/felixdlr4/eam-highlight-video | $200 |

**Check the fourth slug**: `eam-highlight-video` is exactly as supplied, but may be missing a leading `t`. Do not silently rewrite it without confirming the URL displayed by TidyCal. Also verify booked duration, calendar conflicts, correct location questions, price (and any extra processing/platform fee), and Stripe account before merging. The booking page remains `noindex` and is not linked by the site's main public CTAs.
