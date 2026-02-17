import heroImage from "@/assets/hero-court.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Basketball court at night"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4 animate-pulse-glow">
          Find Your Next Game
        </p>
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-foreground leading-[0.9] mb-6 text-glow">
          Run With
          <br />
          <span className="text-primary">Your Squad</span>
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-8">
          Connect with local gyms, find pickup games at your skill level, and never miss a run again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary text-primary-foreground font-display text-lg px-8 py-4 rounded-lg hover:brightness-110 transition-all duration-200 tracking-wider">
            Find a Game
          </button>
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
