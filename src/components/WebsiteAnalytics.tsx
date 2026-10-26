import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ANALYTICS_CONSENT_KEY,
  AnalyticsConsent,
  canTrackWebsite,
  readAnalyticsConsent,
  trackWebsitePage,
} from "@/lib/hubspotTracking";

const WebsiteAnalytics = () => {
  const { pathname } = useLocation();
  const native = Capacitor.isNativePlatform();
  const [consent, setConsent] = useState(readAnalyticsConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!canTrackWebsite(native, window.location.hostname, consent)) return;
    if (lastTrackedPath.current === pathname) return;
    trackWebsitePage(pathname);
    lastTrackedPath.current = pathname;
  }, [consent, native, pathname]);

  const chooseConsent = (choice: AnalyticsConsent) => {
    try {
      localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
    } catch {
      // This browser's choice still applies for the current visit.
    }
    if (choice === "declined" && document.getElementById("hs-script-loader")) {
      window._hsq?.push(["doNotTrack"]);
      // Remove HubSpot analytics cookies, then reload to stop loaded scripts.
      for (const name of ["hubspotutk", "__hstc", "__hssc", "__hssrc"]) {
        for (const domain of ["", window.location.hostname, ".by5.run"]) {
          document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
        }
      }
      window.location.reload();
      return;
    }
    setConsent(choice);
    setSettingsOpen(false);
  };

  if (native) return null;

  if (consent !== null && !settingsOpen) {
    return (
      <div className="fixed bottom-2 left-2 z-40 pb-safe">
        <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
          Cookie settings
        </Button>
      </div>
    );
  }

  return (
    <section aria-label="Website cookie preferences" className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background px-safe pb-safe shadow-lg">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl space-y-1">
          <h2 className="font-display text-lg text-foreground">Your privacy choices</h2>
          <p className="text-sm text-muted-foreground">
            Allow HubSpot analytics cookies to help us understand website visits. Optional cookies stay off unless you accept. <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="outline" onClick={() => chooseConsent("declined")}>Decline</Button>
          <Button onClick={() => chooseConsent("accepted")}>Accept analytics</Button>
        </div>
      </div>
    </section>
  );
};

export default WebsiteAnalytics;