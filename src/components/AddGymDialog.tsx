import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { z } from "zod";

const gymSchema = z.object({
  name: z.string().trim().min(1, "Gym name is required").max(100, "Name too long"),
  address: z.string().trim().min(1, "Address is required").max(200, "Address too long"),
});

interface AddGymDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (gym: { name: string; address: string; rating: number; gamesThisWeek: number }) => void;
}

const AddGymDialog = ({ open, onClose, onAdd }: AddGymDialogProps) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = gymSchema.safeParse({ name, address });
    if (!result.success) {
      const fieldErrors: { name?: string; address?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as "name" | "address";
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    onAdd({ name: result.data.name, address: result.data.address, rating: 0, gamesThisWeek: 0 });
    setName("");
    setAddress("");
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-foreground">Add a Gym</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Gym Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
              placeholder="e.g. Downtown Recreation Center"
              maxLength={100}
              className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={address}
                onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: undefined })); }}
                placeholder="e.g. 123 Main St, City"
                maxLength={200}
                className="w-full bg-secondary text-foreground border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-display text-base py-3 rounded-lg hover:brightness-110 transition-all tracking-wider mt-2"
          >
            Add Gym
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGymDialog;
