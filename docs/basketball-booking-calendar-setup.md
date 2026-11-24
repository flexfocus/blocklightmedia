# Basketball booking calendar — implementation checklist

Status: DRAFT ONLY. No live availability feed or deposit collection has been connected in this PR. The public Book Now buttons remain unchanged, and there are no invented availability slots.

## Approved services and deposits
| Calendly event type | Full package | Deposit taken at booking | Remaining balance |
|---|---:|---:|---:|
| Player Game Photos | $200 | $100 | $100 |
| Team Game Photos | $300 | $150 | $150 |
| Player Highlight Video | $300 | $150 | $150 |
| Team Highlight Video | $400 | $200 | $200 |

Configure the payment amount in **Calendly event settings connected to Stripe**. The displayed prices in HTML are informational and do NOT set the actual checkout amount.

## Required external setup
1. Create/connect a **Calendly** account, with a plan supporting **multiple event types and Stripe payments** (typically Standard or above; verify current plan requirements).
2. Connect the actual filming calendar, and block days with existing commitments. Set realistic operating hours, travel limits, minimum booking notice, cancellation window, and time between games. Bookings generally need a game-length slot, arrival time and travel buffer (not just a 15-minute meeting).
3. Create four paid Calendly event types matching the table, collecting the deposit amounts above. Ensure all are **one host : one client booking**, not group event types that let multiple clients reserve your only camera at once.
4. For each event type add intake questions: athlete name and jersey number (if relevant), school/team, opponent, game date, **game tipoff time**, gym or venue name and full address, organizer contact, any gym/media permission restrictions, and important coverage expectations. **The chosen calendar slot must correspond to the real game start/coverage window**; default generic meeting slots may not match actual games.
5. Confirm Stripe deposit collection is enabled for every event type. Check that live tax settings and refund/cancellation policies are legally appropriate before collecting.
6. Copy four specific Calendly event-type URLs (e.g. https://calendly.com/YOURACCOUNT/PLAYER-PHOTOS). Insert them in `basketball-booking.js` > `BOOKING_LINKS`. Only exact `https://calendly.com` or subdomain HTTPS URLs are allowed. If a URL is missing, the page deliberately shows the existing quote form fallback.
7. In Calendly, run a **live (or safe test if supported) booking check** for every service to verify the customer's selected date/time and Stripe charge. Booking confirmation is owned by Calendly; website never trusts client-side events as proof of payment.
8. After all four work, remove `noindex,nofollow` if desired, expose links from the basketball photography/videography landing pages and homepage, and merge this PR.

## Booking model
- Default proposed booking slot: approximately 2–2.5 hours for one full game **plus travel buffers**. Confirm actual games, venue, location and contractual terms first.
- Do NOT send clients from Calendly to a second Stripe Payment Link, or they may pay twice. Calendly-connected Stripe payment is the one booking transaction.
- For remaining balance, use a per-customer Stripe invoice reflecting deposit already paid.
- This design does not automatically prevent simultaneous bookings if the host calendar is not kept updated or if two scheduling tools use separate calendars.
- Existing site-wide Stripe links and Sweet 16 link are unaffected.
- A partial deposit can automatically lock a game time *only when* the calendars and payment settings are configured consistently. Don't advertise real-time booking before testing.
