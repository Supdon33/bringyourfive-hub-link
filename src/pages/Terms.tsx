import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import Seo from "@/components/Seo";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Terms of Service – Bring Your Five"
        description="Read the Bring Your 5 Terms of Service (EULA) covering accounts, subscriptions, conduct, and liability."
        path="/terms"
      />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">

        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <BrandLogo />
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-20 max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-2">
          Terms of Service – Bring Your 5™
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Effective Date: February 23, 2026 · Last Updated: February 23, 2026
        </p>

        <div className="prose-custom space-y-6 text-foreground/90 text-sm leading-relaxed">
          <p>
            These Terms of Service ("Terms") govern your use of the Bring Your 5 mobile application and related services ("Service"), operated by JGS3 LLC ("Company," "we," "us," or "our").
          </p>
          <p>By accessing or using Bring Your 5, you agree to be bound by these Terms.</p>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">1. Eligibility</h3>
          <p>You must be at least 13 years old to use the Service. If you are under 18, you must have permission from a parent or legal guardian.</p>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">2. Description of Service</h3>
          <p>Bring Your 5 is a platform that allows users to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Organize and join pickup basketball runs</li>
            <li>Form teams and connect with other players</li>
            <li>Communicate and coordinate run logistics</li>
          </ul>
          <p>We do not organize, supervise, or control any runs or events created by users.</p>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">3. User Accounts</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>You are responsible for maintaining the confidentiality of your account</li>
            <li>You agree to provide accurate and complete information</li>
            <li>You are responsible for all activity under your account</li>
          </ul>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">4. User Conduct</h3>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Harass, threaten, or harm other users</li>
            <li>Use the app for unlawful purposes</li>
            <li>Post false, misleading, or inappropriate content</li>
            <li>Attempt to interfere with the app's functionality (e.g., hacking, scraping)</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these rules.</p>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">5. Payments and Subscriptions</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>All payments and subscriptions are processed through Apple's App Store In-App Purchase system</li>
            <li>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period</li>
            <li>You can manage and cancel subscriptions in your Apple ID account settings</li>
            <li>All payments are final unless otherwise stated</li>
          </ul>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">6. Assumption of Risk</h3>
          <p>Participation in basketball and related activities involves inherent physical risks, including injury.</p>
          <p>By using the Service, you acknowledge and agree:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You participate at your own risk</li>
            <li>Bring Your 5 and JGS3 LLC are not responsible for injuries, damages, or disputes arising from user-organized activities</li>
          </ul>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">7. Intellectual Property</h3>
          <p>All content, features, branding, and technology associated with Bring Your 5 are owned by JGS3 LLC and protected under applicable intellectual property laws.</p>
          <p>You may not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Copy, modify, distribute, or reverse engineer any part of the app</li>
          </ul>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">8. Third-Party Services</h3>
          <p>The app may integrate with third-party services (e.g., maps, payments). We are not responsible for their content or practices.</p>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">9. Termination</h3>
          <p>We may suspend or terminate your access at any time for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violations of these Terms</li>
            <li>Harmful or inappropriate behavior</li>
            <li>Legal or security concerns</li>
          </ul>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">10. Disclaimers</h3>
          <p>The Service is provided "as is" without warranties of any kind. We do not guarantee:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Availability of runs or users</li>
            <li>Accuracy of user information</li>
            <li>Safety of events</li>
          </ul>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">11. Limitation of Liability</h3>
          <p>To the fullest extent permitted by law, JGS3 LLC shall not be liable for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of data, profits, or opportunities</li>
          </ul>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">12. Governing Law</h3>
          <p>These Terms are governed by the laws of the State of Maryland, United States.</p>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">13. Changes to Terms</h3>
          <p>We may update these Terms at any time. Continued use of the app constitutes acceptance of the updated Terms.</p>

          <h3 className="font-display text-lg text-foreground mt-8 mb-2">14. Contact Information</h3>
          <p>Email: coach.bringyour5@gmail.com</p>
          <p>Company: JGS3 LLC</p>
        </div>
      </main>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <BrandLogo size="small" />
          <p className="mt-2">Bring Your 5™ is a trademark of JGS3 LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
