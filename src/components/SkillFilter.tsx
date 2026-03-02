import type { SkillLevel } from "./GameCard";

interface SkillFilterProps {
  selected: SkillLevel | "all";
  onChange: (level: SkillLevel | "all") => void;
}

const filters: { label: string; items: { value: SkillLevel | "all"; label: string; dot?: string }[] }[] = [
  { label: "all", items: [{ value: "all", label: "All Levels" }] },
  { label: "elementary", items: [{ value: "elementary", label: "Elementary", dot: "bg-skill-elementary" }] },
  { label: "highschool", items: [
    { value: "highschool_male", label: "HS Male", dot: "bg-skill-highschool-male" },
    { value: "highschool_female", label: "HS Female", dot: "bg-skill-highschool-female" },
  ]},
  { label: "college", items: [
    { value: "college_male", label: "College Male", dot: "bg-skill-college-male" },
    { value: "college_female", label: "College Female", dot: "bg-skill-college-female" },
  ]},
  { label: "adult", items: [
    { value: "adult_male", label: "Adult Male", dot: "bg-skill-adult-male" },
    { value: "adult_female", label: "Adult Female", dot: "bg-skill-adult-female" },
  ]},
];

const SkillFilter = ({ selected, onChange }: SkillFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          {group.items.map((f) => (
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
      ))}
    </div>
  );
};

export default SkillFilter;
