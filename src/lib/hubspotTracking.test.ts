import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { canTrackWebsite, HUBSPOT_SCRIPT_URL, trackWebsitePage } from "./hubspotTracking";

afterEach(() => {
  document.getElementById("hs-script-loader")?.remove();
  delete window._hsq;
});

describe("HubSpot website tracking", () => {
  it("uses Jay's supplied portal and regional script", () => {
    expect(HUBSPOT_SCRIPT_URL).toBe("https://js-na2.hs-scripts.com/245314963.js");
  });
  it("installs the HubSpot code in the page so HubSpot's installation test can find it", () => {
    const html = readFileSync(resolve(__dirname, "../../index.html"), "utf8");
    expect(html).toContain("js-na2.hs-scripts.com/245314963.js");
  });
  it("never enables website tracking in native iOS or Android apps", () => {
    expect(canTrackWebsite(true, "by5.run")).toBe(false);
  });
  it("keeps preview traffic out of the real portal", () => {
    expect(canTrackWebsite(false, "localhost")).toBe(false);
    expect(canTrackWebsite(false, "by5.run")).toBe(true);
    expect(canTrackWebsite(false, "www.by5.run")).toBe(true);
  });
  it("records navigation without query tokens or fragments and loads once", () => {
    trackWebsitePage("/auth?token=private#secret");
    trackWebsitePage("/privacy");
    expect(window._hsq).toEqual([["setPath", "/auth"], ["setPath", "/privacy"], ["trackPageView"]]);
    expect(document.querySelectorAll("#hs-script-loader").length).toBe(1);
  });
});
