import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutDialog = ({ open, onOpenChange }: AboutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">About</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-foreground/90 leading-relaxed mt-2">
          <p>
            Bring Your 5 is the Eco-system for pick up basketball. Pickup basketball has always run on word of mouth — a text thread, a group chat, showing up and hoping enough people are there. Bring Your Five fixes that. We connect you with local gyms and open runs happening near you, matched to your skill level, so you're never standing around wondering if today's the day a game actually comes together.
          </p>
          <p>
            Whether you're looking for a competitive run to sharpen your game or a laid-back pickup session to get some shots up after work, Bring Your Five helps you find your people and your court — no more guessing, no more no-shows, no more missed runs.
          </p>
          <p className="font-semibold text-primary">
            Find your gym. Find your level. Bring your 5.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;
