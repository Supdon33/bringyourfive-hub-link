import heroImage from "@/assets/hero-court.jpg";
import BasketballLogo from "./BasketballLogo";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Basketball court at night"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-6 animate-pulse-glow">
          Find Your Next Game
        </p>

        <BasketballLogo className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 drop-shadow-2xl mb-8" />

        <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-8">
          Connect with local gyms, find pickup games at your skill level, and never miss a run again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#runs" className="bg-primary text-primary-foreground font-display text-lg px-8 py-4 rounded-lg hover:brightness-110 transition-all duration-200 tracking-wider">
            Available Runs
          </a>
          <button className="border border-border text-foreground font-display text-lg px-8 py-4 rounded-lg hover:bg-secondary transition-all duration-200 tracking-wider">
            List Your Gym
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
