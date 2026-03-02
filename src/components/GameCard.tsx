import { MapPin, Clock, Users } from "lucide-react";

export type SkillLevel = "elementary" | "highschool_male" | "highschool_female" | "college_male" | "college_female" | "adult_male" | "adult_female";

interface GameCardProps {
  title: string;
  location: string;
  time: string;
  skillLevel: SkillLevel;
  spotsTotal: number;
  spotsFilled: number;
  gymName: string;
  onClick?: () => void;
}

const skillConfig: Record<SkillLevel, { label: string; colorClass: string }> = {
  elementary: { label: "Elementary", colorClass: "bg-skill-elementary" },
  highschool_male: { label: "High School Male", colorClass: "bg-skill-highschool-male" },
  highschool_female: { label: "High School Female", colorClass: "bg-skill-highschool-female" },
  college_male: { label: "College Male", colorClass: "bg-skill-college-male" },
  college_female: { label: "College Female", colorClass: "bg-skill-college-female" },
  adult_male: { label: "Adult Male", colorClass: "bg-skill-adult-male" },
  adult_female: { label: "Adult Female", colorClass: "bg-skill-adult-female" },
};

const GameCard = ({ title, location, time, skillLevel, spotsTotal, spotsFilled, gymName, onClick }: GameCardProps) => {
  const skill = skillConfig[skillLevel];
  const spotsLeft = spotsTotal - spotsFilled;

  return (
    <div onClick={onClick} className="group rounded-lg bg-card border border-border p-5 card-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <span className={`${skill.colorClass} text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider`}>
          {skill.label}
        </span>
      </div>

      <h3 className="font-display text-xl text-foreground mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{gymName}</p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-primary" />
          {location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary" />
          {time}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" />
          {spotsFilled}/{spotsTotal}
        </span>
      </div>

      <div className="mt-4 w-full bg-secondary rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${(spotsFilled / spotsTotal) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default GameCard;
