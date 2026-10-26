import { afterEach, describe, expect, it } from "vitest";
import { canTrackWebsite, HUBSPOT_SCRIPT_URL, trackWebsitePage } from "./hubspotTracking";

afterEach(() => {
  document.getElementById("hs-script-loader")?.remove();
  delete window._hsq;
});

describe("HubSpot website tracking", () => {
  it("uses Jay's supplied portal and regional script", () => {
    trackWebsitePage("/");
    expect(document.getElementById("hs-script-loader")?.getAttribute("src")).toBe("https://js-na2.hs-scripts.com/245314963.js");
    expect(HUBSPOT_SCRIPT_URL).toContain("245314963");
  });
  it("never enables website tracking in native iOS or Android apps", () => {
    expect(canTrackWebsite(true, "by5.run", "accepted")).toBe(false);
  });
  it("requires explicit analytics consent", () => {
    expect(canTrackWebsite(false, "by5.run", null)).toBe(false);
    expect(canTrackWebsite(false, "by5.run", "declined")).toBe(false);
    expect(canTrackWebsite(false, "by5.run", "accepted")).toBe(true);
  });
  it("keeps preview traffic out of the real portal", () => {
    expect(canTrackWebsite(false, "localhost", "accepted")).toBe(false);
    expect(canTrackWebsite(false, "www.by5.run", "accepted")).toBe(true);
  });
  it("records navigation without query tokens or fragments and loads once", () => {
    trackWebsitePage("/auth?token=private#secret");
    trackWebsitePage("/privacy");
    expect(window._hsq).toEqual([["setPath", "/auth"], ["setPath", "/privacy"], ["trackPageView"]]);
    expect(document.querySelectorAll("#hs-script-loader").length).toBe(1);
  });
});