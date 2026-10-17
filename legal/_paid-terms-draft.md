# echo·11 — paid-version legal changes (DRAFT, not deployed)

> Excluded from the deployment by `.vercelignore`. Nothing here is live.
> Apply these edits to `legal/terms.html` and `legal/privacy.html` **on the
> same day** `PAYWALL_ENABLED` becomes `true` in `config.js`, and bump
> "Last updated" on both pages. Have the final text checked by someone
> qualified before it goes live — this is a plain-language draft, not legal advice.
>
> Placeholders to fill in: `[LEGAL NAME / BUSINESS NAME]`, `[SUPPORT EMAIL]`,
> `[EFFECTIVE DATE]`.

---

## terms.html

### Remove

- The "Beta status" callout at the top (*free, invite-only beta, no payments*).
- Section **3. Beta access — free, no payments**.

### Replace section 3 with: **3. The Founding Pass — payments**

Four frequencies are free to use. The **Founding Pass** is an optional,
**one-time purchase** that unlocks all 22 frequencies and the full gallery
for the lifetime of the echo·11 web app. It is not a subscription: you are
charged once, and nothing renews.

Purchases are sold and processed by **Lemon Squeezy** (Lemon Squeezy, LLC),
which acts as the **merchant of record**. That means Lemon Squeezy is the
seller on your receipt: it takes the payment, charges and remits any
applicable sales tax or VAT, and issues your invoice. Your purchase is also
subject to Lemon Squeezy's own terms and buyer policies. echo·11 never sees
or stores your card details.

The price is shown before you pay, in the checkout. Prices may change for
future buyers; a change never affects a Founding Pass you already own.

### Add section: **Refunds**

If the Founding Pass isn't right for you, ask for a refund **within 14 days
of purchase** and you'll get one — **no questions asked**. Reply to your
receipt email or write to [SUPPORT EMAIL]. Refunds are issued by Lemon
Squeezy to your original payment method; how quickly the money arrives
depends on your bank. When a refund is issued, the license key is disabled
and the paid content locks again on every device.

This doesn't limit any rights you have under the consumer law of the country
you live in.

### Add section: **License keys**

After purchase you receive a **license key** by email. Enter it in the app
(any locked item → *I have a license key* → **Activate**) to unlock the
Founding Pass on that device or browser.

- The key is personal to you. Don't share or resell it.
- Each key can be activated on a limited number of devices. If you run out,
  contact support and we'll free one up.
- Clearing your browser data, using a different browser, or using
  **Delete my account** removes the pass from that device. Re-activate it
  any time with the same key (*Restore a pass on this device*).
- We may disable a key that has been refunded, charged back, or shared
  publicly.

### Edit **9. Termination**

Add: *If we ever shut down the echo·11 web app, we'll give at least 30 days'
notice by email to Founding Pass holders who have shared an email address
with us through their purchase.*

---

## privacy.html

### Remove

- The "Beta status" callout at the top.
- Section **6. Payments** ("None. The beta is free…").

### Replace section 6 with: **6. Payments**

The Founding Pass is sold by **Lemon Squeezy**, our merchant of record.
When you buy, you enter your payment details, name, email address and
billing country **directly with Lemon Squeezy**, not with echo·11. Lemon
Squeezy processes that data under its own privacy policy
(https://www.lemonsqueezy.com/privacy) to take payment, prevent fraud,
handle tax and send your receipt and license key.

From Lemon Squeezy, echo·11 receives order information (what was bought,
when, the order and license status, and the email address used) so we can
support you and honour refunds. We never receive or store full card
numbers.

### Add to **2. Information we collect** — "License key"

When you activate a Founding Pass, the app stores on **your device**
(browser local storage, key `echo:license`): your license key, an
activation ID, and the date it was activated. To check the key, the app
sends the key and a generic device label (for example
"echo11.space · iPhone/iPad") to Lemon Squeezy's License API through our
own server (`/api/license`). Our server passes the request through and does
not keep it. About once a week the app re-checks the key the same way, so a
refunded key stops working.

### Add to **5. How information is processed and shared**

Add Lemon Squeezy (payments, tax, receipts, license keys) and Vercel
(hosting of the `/api/license` check) to the list of service providers.

### Edit **7. Data retention**

Add: *Your license key stays on your device until you clear your browser
data or use Delete my account. Lemon Squeezy keeps order records as
required by tax and accounting law.*

### Edit **8. Your rights**

Add: *For your purchase record, contact us at [SUPPORT EMAIL] or Lemon
Squeezy directly.*
