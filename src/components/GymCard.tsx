import { MapPin, Star } from "lucide-react";

interface GymCardProps {
  name: string;
  address: string;
  rating: number;
  gamesThisWeek: number;
  imageUrl?: string;
}

const GymCard = ({ name, address, rating, gamesThisWeek }: GymCardProps) => {
  return (
    <div className="group rounded-lg bg-card border border-border p-5 card-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="w-full h-32 bg-secondary rounded-md mb-4 flex items-center justify-center overflow-hidden">
        <span className="text-4xl">🏀</span>
      </div>

      <h3 className="font-display text-lg text-foreground mb-1">{name}</h3>

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        {address}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-primary">
          <Star className="w-3.5 h-3.5 fill-primary" />
          {rating.toFixed(1)}
        </span>
        <span className="text-muted-foreground">
          {gamesThisWeek} game{gamesThisWeek !== 1 ? "s" : ""} this week
        </span>
      </div>
    </div>
  );
};

export default GymCard;
