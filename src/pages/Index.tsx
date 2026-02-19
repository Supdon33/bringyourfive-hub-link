import { useState } from "react";
import { Plus, Menu, X } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import BrandLogo from "@/components/BrandLogo";
import GameCard, { type SkillLevel } from "@/components/GameCard";
import SkillFilter from "@/components/SkillFilter";
import GymCard from "@/components/GymCard";
import AddGymDialog from "@/components/AddGymDialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const games = [
  { title: "5v5 Open Run", location: "Downtown", time: "6:00 PM", skillLevel: "adult" as SkillLevel, spotsTotal: 10, spotsFilled: 7, gymName: "City Rec Center" },
  { title: "3v3 Half Court", location: "Westside", time: "4:00 PM", skillLevel: "highschool" as SkillLevel, spotsTotal: 6, spotsFilled: 4, gymName: "Westside YMCA" },
  { title: "Youth Skills Clinic", location: "Northpark", time: "10:00 AM", skillLevel: "elementary" as SkillLevel, spotsTotal: 12, spotsFilled: 8, gymName: "Northpark Community" },
  { title: "College Level Run", location: "Midtown", time: "8:00 PM", skillLevel: "college" as SkillLevel, spotsTotal: 10, spotsFilled: 9, gymName: "Elite Sports Complex" },
  { title: "Pickup Full Court", location: "Eastside", time: "7:00 PM", skillLevel: "adult" as SkillLevel, spotsTotal: 10, spotsFilled: 3, gymName: "Eastside Fitness" },
  { title: "After School Hoops", location: "Southgate", time: "3:30 PM", skillLevel: "highschool" as SkillLevel, spotsTotal: 8, spotsFilled: 6, gymName: "Southgate High Gym" },
];

const gyms = [
  { name: "City Rec Center", address: "123 Main St, Downtown", rating: 4.5, gamesThisWeek: 8 },
  { name: "Westside YMCA", address: "456 Oak Ave, Westside", rating: 4.2, gamesThisWeek: 5 },
  { name: "Elite Sports Complex", address: "789 Court Dr, Midtown", rating: 4.8, gamesThisWeek: 12 },
  { name: "Northpark Community", address: "321 Park Ln, Northpark", rating: 4.0, gamesThisWeek: 3 },
];

const Index = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillLevel | "all">("all");
  const [gymList, setGymList] = useState(gyms);
  const [showAddGym, setShowAddGym] = useState(false);

  const filteredGames = selectedSkill === "all"
    ? games
    : games.filter((g) => g.skillLevel === selectedSkill);

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
          <div className="hidden sm:block">
            <button className="bg-primary text-primary-foreground font-semibold text-sm px-5 py-2 rounded-lg hover:brightness-110 transition-all">
              Sign Up
            </button>
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
                <button className="bg-primary text-primary-foreground font-semibold text-sm px-5 py-2 rounded-lg hover:brightness-110 transition-all w-full">
                  Sign Up
                </button>
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
          <SkillFilter selected={selectedSkill} onChange={setSelectedSkill} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((game, i) => (
            <GameCard key={i} {...game} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No games at this level right now.</p>
            <p className="text-sm mt-1">Check back soon or try another skill level.</p>
          </div>
        )}
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
