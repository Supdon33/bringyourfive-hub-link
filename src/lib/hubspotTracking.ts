export const HUBSPOT_SCRIPT_URL = "https://js-na2.hs-scripts.com/245314963.js";
const WEBSITE_HOSTS = ["by5.run", "www.by5.run"];

declare global {
  interface Window {
    _hsq?: unknown[][];
  }
}

// HubSpot's own cookie banner (Privacy & Consent settings in HubSpot) handles visitor consent.
export function canTrackWebsite(native: boolean, hostname: string) {
  return !native && WEBSITE_HOSTS.includes(hostname);
}

/** Records an in-app page change. The first page view is recorded by the loader in index.html. */
export function trackWebsitePage(path: string) {
  // Exclude queries and hashes: auth links can contain tokens and personal data.
  const safePath = path.split(/[?#]/)[0];
  window._hsq = window._hsq || [];
  window._hsq.push(["setPath", safePath]);
  if (document.getElementById("hs-script-loader")) {
    window._hsq.push(["trackPageView"]);
    return;
  }
  // Fallback if the index.html loader did not run; HubSpot records a view when it initializes.
  const script = document.createElement("script");
  script.id = "hs-script-loader";
  script.src = HUBSPOT_SCRIPT_URL;
  script.type = "text/javascript";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}
