const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota",
  "Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
  "Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah",
  "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

interface StateFilterProps {
  selected: string;
  onChange: (state: string) => void;
}

const StateFilter = ({ selected, onChange }: StateFilterProps) => {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <option value="all">All States</option>
      {US_STATES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
};

export default StateFilter;
