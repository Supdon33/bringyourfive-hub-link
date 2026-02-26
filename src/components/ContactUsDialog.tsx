import { useState } from "react";
import { MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ContactUsDialog = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const mailtoLink = `mailto:coach.bringyour5@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-3 rounded-full shadow-lg hover:brightness-110 transition-all">
          <MessageSquare className="w-4 h-4" />
          Contact Us
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="What's this about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your message..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button onClick={handleSend} className="w-full" disabled={!subject.trim() || !message.trim()}>
            Send Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUsDialog;
