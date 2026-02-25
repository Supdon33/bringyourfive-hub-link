import { useState } from "react";
import { Plus, Menu, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import BrandLogo from "@/components/BrandLogo";
import GameCard, { type SkillLevel } from "@/components/GameCard";
import SkillFilter from "@/components/SkillFilter";
import GymCard from "@/components/GymCard";
import AddGymDialog from "@/components/AddGymDialog";
import ListRunDialog from "@/components/ListRunDialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useRuns } from "@/hooks/useRuns";
import { Lock, Loader2 } from "lucide-react";

const gyms = [
  { name: "Athletic Republic", address: "6417 Marlboro Pike, District Heights, MD 20747", rating: 5.0, gamesThisWeek: 8 },
];

const Index = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillLevel | "all">("all");
  const [gymList, setGymList] = useState(gyms);
  const [showAddGym, setShowAddGym] = useState(false);
  const [showListRun, setShowListRun] = useState(false);
  const { user, hasActiveSub, loading, signOut } = useAuth();

  const { data: runs = [], isLoading: runsLoading } = useRuns(selectedSkill);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <BrandLogo />
          <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#runs" className="hover:text-foreground transition-colors">Runs</a>
            <a href="#gyms" className="hover:text-foreground transition-colors">Gyms</a>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.user_metadata?.first_name || user.email}
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground">Available Runs</h2>
            <p className="text-muted-foreground mt-1">Find a run that matches your level</p>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={() => setShowListRun(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
              >
                <Plus className="w-4 h-4" />
                List a Run
              </button>
            )}
            <SkillFilter selected={selectedSkill} onChange={setSelectedSkill} />
          </div>
        </div>

        {/* Gated content */}
        {!loading && false ? (
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
          <button
            onClick={() => setShowAddGym(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Gym
          </button>
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
        onAdded={() => {/* will refetch from DB in future */}}
        gyms={gymList}
      />

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <BrandLogo size="small" />
          <p className="mt-2">Connecting ballers with courts since 2025.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
