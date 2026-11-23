# Block Light Media — Booking & Pricing Plan (DRAFT)

**Status:** Internal proposal only. Not a public offer, approved rate card, reservation system, or payment integration.

## Fixed-price photography template

| Service | Package | Proposed total | Deposit | Balance | Status |
|---|---|---:|---:|---:|---|
| Basketball photography | Team Coverage | $500 | 50% ($250) | $250 | **DRAFT — not approved for sale** |

### Team Coverage scope (proposed)
- **Coverage:** One full basketball game, one team.
- **Deliverables:** Minimum 20 edited photographs.
- **Turnaround:** Digital gallery delivered within 48 hours after the game.
- **Client inputs:** Name, email, optional phone, team, date, tipoff time, venue, notes.
- **Reservation:** Client date request → manual availability check → written terms → deposit request → payment verification → booking confirmed.
- **No automatic availability promise:** A requested date is not held or confirmed.
- **No active payment:** Do not create a live Stripe Checkout link, live invoice, or payment button until the owner explicitly authorizes activation.
- **Before launch:** Confirm travel charges, usage rights, rescheduling/cancellation/refund rules, remaining balance due date, and who handles final approval.

## Pricing-system design for all services

Maintain **one configuration record per package**, rather than sharing Team Coverage's $500 price across all services. A future reusable booking UI should read the chosen package's price, deposit percentage, duration, deliverables, lead time, and booking mode from its record. Proposed statuses: `draft`, `approved`, `published`, `retired`.

- **Fixed-price offerings:** Session photography (e.g., individual athlete coverage, headshots, maternity, graduation), each with individually approved pricing and booking rules.
- **Quote-first offerings:** Commercial video, corporate campaigns, weddings and multi-day events. Do not imply they have fixed prices.
- **No prices approved for the other services yet.** Do not automatically copy $500/50% to them.
- **Admin edits:** Changing a proposed price updates the draft, but does not itself publish a price or change an existing Stripe invoice. Later payment integrations must calculate charges server-side from approved, versioned pricing—not customer-provided amounts.

## Current code safeguards

- The existing `team-coverage-booking-preview.html` already shows the $500 / $250 / $250 proposal.
- Its request form intentionally prevents submissions; the payment button is disabled.
- The live `project-inquiry` contact form remains independent and should not be changed as part of this pricing-plan update.

**Owner approval is required separately** for public pricing, form activation, real-time scheduling, and any live payment collection.
