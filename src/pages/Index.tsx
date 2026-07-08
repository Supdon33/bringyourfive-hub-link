import { useState, useEffect } from "react";
import { Plus, Menu, LogOut, MoreVertical, Mail, Shield, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HeroSection from "@/components/HeroSection";
import BrandLogo from "@/components/BrandLogo";
import GameCard, { type SkillLevel } from "@/components/GameCard";
import SkillFilter from "@/components/SkillFilter";
import StateFilter from "@/components/StateFilter";
import GymCard from "@/components/GymCard";
import AddGymDialog from "@/components/AddGymDialog";
import ListRunDialog from "@/components/ListRunDialog";
import RunDetailDialog from "@/components/RunDetailDialog";
import ContactUsDialog from "@/components/ContactUsDialog";
import AccountDialog from "@/components/AccountDialog";
import IAPUpgradeDialog from "@/components/IAPUpgradeDialog";
import { isNativeIOS } from "@/lib/purchases";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useRuns } from "@/hooks/useRuns";
import { useRunNotifications } from "@/hooks/useRunNotifications";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2 } from "lucide-react";

const gyms = [
  { name: "Athletic Republic", address: "6417 Marlboro Pike, District Heights, MD 20747", rating: 5.0, gamesThisWeek: 8 },
];

const Index = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillLevel | "all">("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [gymList, setGymList] = useState(gyms);
  const [showAddGym, setShowAddGym] = useState(false);
  const [showListRun, setShowListRun] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedRun, setSelectedRun] = useState<{
    id: string; title: string; gymName: string; location: string;
    time: string; skillLevel: SkillLevel; spotsTotal: number; spotsFilled: number;
  } | null>(null);
  const { user, username, hasActiveSub, hasTier, loading, signOut } = useAuth();

  // Auto-set state filter for basic users
  useEffect(() => {
    if (user && !hasTier("tier2")) {
      supabase
        .from("profiles")
        .select("home_state")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.home_state) {
            setSelectedState(data.home_state);
          }
        });
    }
  }, [user, hasTier]);

  const { data: runs = [], isLoading: runsLoading } = useRuns(selectedSkill, selectedState);
  
  useRunNotifications();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <BrandLogo />
          <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#runs" className="hover:text-foreground transition-colors">Runs</a>
            <a href="#gyms" className="hover:text-foreground transition-colors">Gyms</a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:text-foreground transition-colors p-1">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user && (
                  <DropdownMenuItem onClick={() => setShowAccount(true)}>
                    <UserIcon className="w-4 h-4 mr-2" />
                    Account
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setShowContact(true)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/privacy">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Notice
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {username || user.user_metadata?.first_name || user.email}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-primary text-primary-foreground font-semibold text-sm px-5 py-2 rounded-lg hover:brightness-110 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <button className="sm:hidden p-2 text-foreground">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-background border-border">
              <nav className="flex flex-col gap-6 mt-8">
                <a href="#runs" className="text-lg font-display text-foreground hover:text-primary transition-colors">Runs</a>
                <a href="#gyms" className="text-lg font-display text-foreground hover:text-primary transition-colors">Gyms</a>
                <button onClick={() => setShowContact(true)} className="text-lg font-display text-foreground hover:text-primary transition-colors text-left flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </button>
                <Link to="/privacy" className="text-lg font-display text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy Notice
                </Link>
                {user && (
                  <button onClick={() => setShowAccount(true)} className="text-lg font-display text-foreground hover:text-primary transition-colors text-left flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Account
                  </button>
                )}
                {user ? (
                  <button
                    onClick={signOut}
                    className="bg-primary text-primary-foreground font-semibold text-sm px-5 py-2 rounded-lg hover:brightness-110 transition-all w-full"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/auth" className="text-lg font-display text-foreground hover:text-primary transition-colors">Sign In</Link>
                    <Link to="/auth" className="bg-primary text-primary-foreground font-semibold text-sm px-5 py-2 rounded-lg hover:brightness-110 transition-all w-full text-center">
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <HeroSection />

      {/* Games Section */}
      <section id="runs" className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground">Available Runs</h2>
            <p className="text-muted-foreground mt-1">Find a run that matches your level</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:flex-wrap">
            {user && (
              <button
                onClick={() => setShowListRun(true)}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                List a Run
              </button>
            )}
            <SkillFilter selected={selectedSkill} onChange={setSelectedSkill} />
          </div>
        </div>

        {/* State Filter */}
        {user && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-muted-foreground">Filter by state:</span>
            <StateFilter selected={selectedState} onChange={setSelectedState} />
            {!hasTier("tier2") && (
              <span className="text-xs text-muted-foreground italic">
                Basic members see runs in their home state. Upgrade to Premium for all states.
              </span>
            )}
            {!hasTier("tier2") && isNativeIOS() && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="ml-2 text-xs font-semibold text-primary underline underline-offset-2"
              >
                Upgrade
              </button>
            )}
          </div>
        )}

        {/* Gated content */}
        {!loading && !user ? (
          <div className="text-center py-20 border border-border rounded-lg bg-card">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-2xl text-foreground mb-2">Please Login to see Available Runs</h3>
            <p className="text-muted-foreground mb-6">
              Sign in or create an account to view and join runs.
            </p>
            <Link
              to="/auth"
              className="bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Sign In
            </Link>
          </div>
        ) : !loading && false ? (
          <div className="text-center py-20 border border-border rounded-lg bg-card">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-2xl text-foreground mb-2">Subscribers Only</h3>
            <p className="text-muted-foreground mb-1">
              {!user
                ? "Sign up and subscribe to see available runs."
                : "An active subscription is required to view runs."}
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Tier 1 (Local): $2.99/mo · Tier 2 (Nationwide): $4.99/mo
            </p>
            {!user && (
              <Link
                to="/auth"
                className="bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-lg hover:brightness-110 transition-all"
              >
                Get Started
              </Link>
            )}
          </div>
        ) : runsLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {runs.map((run) => (
                <GameCard
                  key={run.id}
                  title={run.title}
                  location={run.location}
                  time={run.time}
                  skillLevel={run.skill_level as SkillLevel}
                  spotsTotal={run.spots_total}
                  spotsFilled={run.spots_filled}
                  gymName={run.gym_name}
                  onClick={() => setSelectedRun({
                    id: run.id,
                    title: run.title,
                    gymName: run.gym_name,
                    location: run.location,
                    time: run.time,
                    skillLevel: run.skill_level as SkillLevel,
                    spotsTotal: run.spots_total,
                    spotsFilled: run.spots_filled,
                  })}
                />
              ))}
            </div>

            {runs.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No games at this level right now.</p>
                <p className="text-sm mt-1">Check back soon or try another skill level.</p>
              </div>
            )}
          </>
        )}

        <p className="text-muted-foreground text-xs mt-6 italic">
          * Some facilities may have an entry fee.
        </p>
      </section>

      {/* Gyms Section */}
      <section id="gyms" className="container mx-auto px-4 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-2">Featured Gyms</h2>
            <p className="text-muted-foreground">Local courts hosting pickup games</p>
          </div>
          {user && (
            <button
              onClick={() => setShowAddGym(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Gym
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {gymList.map((gym, i) => (
            <GymCard key={i} {...gym} />
          ))}
        </div>
      </section>

      <AddGymDialog
        open={showAddGym}
        onClose={() => setShowAddGym(false)}
        onAdd={(gym) => setGymList((prev) => [...prev, gym])}
      />

      <ListRunDialog
        open={showListRun}
        onClose={() => setShowListRun(false)}
        onAdded={() => {}}
      />

      <RunDetailDialog
        open={!!selectedRun}
        onClose={() => setSelectedRun(null)}
        run={selectedRun}
      />

      <ContactUsDialog open={showContact} onOpenChange={setShowContact} />

      <AccountDialog open={showAccount} onOpenChange={setShowAccount} />
      <IAPUpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <BrandLogo size="small" />
          <p className="mt-2">Connecting ballers with courts since 2025.</p>
          <p className="mt-1 text-xs">Bring Your 5™ is a trademark of JGS3 LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
