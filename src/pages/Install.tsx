import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Smartphone, Share } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <Smartphone className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Install Bring Your 5</h1>
          <p className="text-muted-foreground">
            Add the app to your home screen for the best experience — quick access, offline support, and a native feel.
          </p>
        </div>

        {isInstalled ? (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 mx-auto text-accent" />
            <p className="text-foreground font-medium">App is already installed!</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Open App
            </Button>
          </div>
        ) : isIOS ? (
          <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4">
            <p className="text-foreground font-semibold">To install on iPhone / iPad:</p>
            <ol className="space-y-3 text-muted-foreground text-sm">
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span>Tap the <Share className="inline w-4 h-4 -mt-0.5" /> <strong>Share</strong> button in Safari</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span>Tap <strong>"Add"</strong> to confirm</span>
              </li>
            </ol>
          </div>
        ) : deferredPrompt ? (
          <Button onClick={handleInstall} size="lg" className="w-full gap-2">
            <Download className="w-5 h-5" />
            Install App
          </Button>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4">
            <p className="text-foreground font-semibold">To install:</p>
            <p className="text-muted-foreground text-sm">
              Open your browser menu (⋮) and tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.
            </p>
          </div>
        )}

        <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">
          Back to App
        </Button>
      </div>
    </div>
  );
};

export default Install;
