export const HUBSPOT_SCRIPT_URL = "https://js-na2.hs-scripts.com/245314963.js";
export const ANALYTICS_CONSENT_KEY = "by5:website-analytics-consent";
export type AnalyticsConsent = "accepted" | "declined";

declare global {
  interface Window {
    _hsq?: unknown[][];
  }
}

export function canTrackWebsite(native: boolean, hostname: string, consent: AnalyticsConsent | null) {
  return !native && ["by5.run", "www.by5.run"].includes(hostname) && consent === "accepted";
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const value = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function trackWebsitePage(path: string) {
  // Exclude queries and hashes: auth links can contain tokens and personal data.
  const safePath = path.split(/[?#]/)[0];
  window._hsq = window._hsq || [];
  window._hsq.push(["setPath", safePath]);
  if (document.getElementById("hs-script-loader")) {
    window._hsq.push(["trackPageView"]);
    return;
  }
  // HubSpot records the initial page view when the loader initializes.
  const script = document.createElement("script");
  script.id = "hs-script-loader";
  script.src = HUBSPOT_SCRIPT_URL;
  script.type = "text/javascript";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}