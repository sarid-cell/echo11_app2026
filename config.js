/* echo·11 — launch switches. Loaded before echo11-app-data.js.
   While PAYWALL_ENABLED is false everything is open and nothing can charge.
   Going live = PAYWALL_ENABLED: true + a real CHECKOUT_URL. */
window.ECHO_CONFIG = {
  PAYWALL_ENABLED: false,
  CHECKOUT_URL: "",          // Lemon Squeezy checkout link, added later
  PRICE_LABEL: "$12 · one-time",
  FREE_FREQS: ["Alpha Clarity","Theta Drift","Delta Sleep","The Universe"]
};
