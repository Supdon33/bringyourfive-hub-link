import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BrandLogo from "@/components/BrandLogo";
import Seo from "@/components/Seo";

import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";
import { useToast } from "@/hooks/use-toast";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota",
  "Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
  "Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah",
  "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sign In state
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [homeState, setHomeState] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [sex, setSex] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [accountType, setAccountType] = useState<"individual" | "gym">("individual");
  const [signupTier, setSignupTier] = useState<"tier1" | "tier2">("tier1");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Look up email by username via a secure backend function
    const { data: lookup, error: lookupError } = await supabase.functions.invoke("lookup-username", {
      body: { username: signInUsername },
    });

    if (lookupError || !lookup?.email) {
      setLoading(false);
      toast({ title: "Sign in failed", description: "Username not found.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: lookup.email,

      password: signInPassword,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !email || !password || !dateOfBirth) {
      toast({ title: "Missing fields", description: "Please fill all required fields, including date of birth.", variant: "destructive" });
      return;
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 13) {
      toast({ title: "Age requirement", description: "You must be at least 13 years old to sign up.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          first_name: firstName,
          last_name: lastName,
          username,
          account_type: accountType,
          signup_tier: signupTier,
          cell_phone: cellPhone || null,
          skill_level: skillLevel || null,
          sex: sex || null,
          home_state: homeState || null,
          date_of_birth: dateOfBirth,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We sent a verification link to your email address." });
      // Fire-and-forget HubSpot sync
      supabase.functions.invoke("sync-hubspot-contact", {
        body: { email, firstName, lastName, cellPhone, homeState },
      }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Seo
        title="Sign In or Join – Bring Your Five"
        description="Sign in or create your Bring Your 5 account to find pickup basketball runs at your skill level near you."
        path="/auth"
      />
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 mb-8">
          <BrandLogo />
          <h1 className="font-display text-2xl text-foreground tracking-wide">
            {mode === "signin" ? "Sign In to Bring Your 5" : "Join Bring Your 5"}
          </h1>
        </div>


        {/* Tabs */}
        <div className="flex mb-6 border-b border-border">
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 pb-3 text-center font-display text-lg tracking-wider transition-colors ${
              mode === "signin" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 pb-3 text-center font-display text-lg tracking-wider transition-colors ${
              mode === "signup" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="signin-username">Username</Label>
              <Input id="signin-username" type="text" value={signInUsername} onChange={(e) => setSignInUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="signin-password">Password</Label>
              <Input id="signin-password" type="password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} required />
            </div>
            <div className="flex justify-end">
              <ForgotPasswordDialog />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Account Type Selection */}
            <div className="space-y-2">
              <Label>I am signing up as *</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType("individual")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    accountType === "individual"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">🏀</span>
                  <span className="font-display text-sm tracking-wider">Individual</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("gym")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    accountType === "gym"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">🏟️</span>
                  <span className="font-display text-sm tracking-wider">Gym</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">{accountType === "gym" ? "Contact First Name *" : "First Name *"}</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="lastName">{accountType === "gym" ? "Contact Last Name *" : "Last Name *"}</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <div>
              <Label htmlFor="cellPhone">Cell Phone</Label>
              <Input id="cellPhone" type="tel" value={cellPhone} onChange={(e) => setCellPhone(e.target.value)} />
            </div>
            {accountType === "individual" && (
            <>
              <div>
                <Label htmlFor="skillLevel">Skill Level</Label>
                <select
                  id="skillLevel"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select skill level…</option>
                  <option value="elementary">Elementary</option>
                  <option value="highschool_male">High School Male</option>
                  <option value="highschool_female">High School Female</option>
                  <option value="college_male">College Male</option>
                  <option value="college_female">College Female</option>
                  <option value="adult_male">Adult Male</option>
                  <option value="adult_female">Adult Female</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sex">Sex *</Label>
                <select
                  id="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </>
            )}
            {/* Membership Tier Selection */}
            <div className="space-y-2">
              <Label>Membership *</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSignupTier("tier1")}
                  className={`flex flex-col items-center gap-1 rounded-lg border-2 p-4 transition-colors ${
                    signupTier === "tier1"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="font-display text-sm tracking-wider">Basic</span>
                  <span className="text-xs text-muted-foreground">Runs in your state</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignupTier("tier2")}
                  className={`flex flex-col items-center gap-1 rounded-lg border-2 p-4 transition-colors ${
                    signupTier === "tier2"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="font-display text-sm tracking-wider">Premium</span>
                  <span className="text-xs text-muted-foreground">Runs in all states</span>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="homeState">Home State *</Label>
              <select
                id="homeState"
                value={homeState}
                onChange={(e) => setHomeState(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select state…</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Sign Up"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
