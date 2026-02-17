import type { SkillLevel } from "./GameCard";

interface SkillFilterProps {
  selected: SkillLevel | "all";
  onChange: (level: SkillLevel | "all") => void;
}

const filters: { value: SkillLevel | "all"; label: string; dot?: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "elementary", label: "Elementary", dot: "bg-skill-elementary" },
  { value: "highschool", label: "High School", dot: "bg-skill-highschool" },
  { value: "college", label: "College", dot: "bg-skill-college" },
  { value: "adult", label: "Adult", dot: "bg-skill-adult" },
];

const SkillFilter = ({ selected, onChange }: SkillFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            selected === f.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
          }`}
        >
          {f.dot && <span className={`w-2 h-2 rounded-full ${f.dot}`} />}
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default SkillFilter;
