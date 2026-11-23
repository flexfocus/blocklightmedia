BLOCK LIGHT MEDIA — LAUNCH WEBSITE / NOVEMBER 2026

STATUS: Site files complete; not published. This is a working launch draft.
Brand name: Block Light Media (temporary); creative lead: Flex Focus.

PUBLISH
1. Open https://app.netlify.com/drop and sign in to Netlify.
2. Upload the folder containing index.html or upload the ZIP of files.
3. Claim or associate the site with your account if prompted. Save the netlify.app address.
4. IMPORTANT: On the Netlify dashboard, open your site > Forms and ENABLE FORM DETECTION for this site. Netlify's 2026 documentation says form detection may need to be enabled manually. REDEPLOY the folder after enabling detection so Netlify recognizes 'project-inquiry'.
5. Submit a TEST inquiry on the live site. Confirm it appears under Netlify > Forms > project-inquiry. Set up email notifications if available in your plan and test those too. Do NOT advertise the contact form until you verify receipt.
6. In Project configuration, customize your netlify.app site name if desired. Add a custom domain later.

BEFORE PUBLIC PROMOTION
- Replace temporary brand if business name changes.
- Add real portfolio footage and photographs: work.html placeholders intentionally avoid misrepresenting stock as client work.
- Verify all service wording, coverage, pricing terms and client agreements.
- Add verified social media links and client testimonials only when supplied.
- Test mobile menus, service links, and form on phone.
- Set up Google Search Console after you confirm site URL and publish.

PLANNED LATER
- Booking availability + contracts + 50% deposit payments (NOT live).
- Instagram / TikTok / YouTube embeds (NOT connected).
- Printful shop (NOT live).
- Advanced cinematic scroll interactions / project videos.

NO LIVE PAYMENTS OR BOOKING ARE ENABLED. THIS SITE ONLY REQUESTS AN INQUIRY.

EXPANSION UPDATE / NOVEMBER 2026
- New navigation: Home | Photography | Videography | Work | About | Get a Quote.
- 24 service pages (12 photography, 12 videography); copy lives in site-src/services.mjs.
  After editing, run: node site-src/build.mjs  (see site-src/INTEGRATIONS.md).
- Service "Get a Quote" buttons preselect the service on the contact form.
  Form name, fields and /thanks page are unchanged; new hidden field: referring-service.
- After publishing: submit https://blocklightmedia.netlify.app/sitemap.xml in Google Search Console,
  then send one test inquiry from a service page and confirm it arrives in Netlify > Forms.
- If a custom domain is added, change `origin` in site-src/config.mjs and rebuild.
