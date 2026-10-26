import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { useLocation } from "react-router-dom";
import { canTrackWebsite, trackWebsitePage } from "@/lib/hubspotTracking";

/** Sends page changes to HubSpot on by5.run. Consent is collected by HubSpot's own cookie banner. */
const WebsiteAnalytics = () => {
  const { pathname } = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!canTrackWebsite(Capacitor.isNativePlatform(), window.location.hostname)) return;
    if (lastTrackedPath.current === null) {
      // The loader in index.html already recorded the first page.
      lastTrackedPath.current = pathname;
      return;
    }
    if (lastTrackedPath.current === pathname) return;
    trackWebsitePage(pathname);
    lastTrackedPath.current = pathname;
  }, [pathname]);

  return null;
};

export default WebsiteAnalytics;
