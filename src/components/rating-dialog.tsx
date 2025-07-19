"use client";

import * as React from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface RatingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
}

export function RatingDialog({ isOpen, onOpenChange, userName }: RatingDialogProps) {
  const { toast } = useToast();
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [review, setReview] = React.useState("");
  const [name, setName] = React.useState(userName);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
        // If dialog is closed (skipped), mark as rated
        localStorage.setItem('hasRated', 'true');
    }
    onOpenChange(open);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Please select a rating.",
        description: "Click on the stars to give a rating.",
      });
      return;
    }
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Please enter your name.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, review }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error("Failed to submit review.");
      }
      
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      });
      localStorage.setItem('hasRated', 'true'); // Also mark as rated on successful submission
      onOpenChange(false);
      setRating(0);
      setReview("");

    } catch (error)
 {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Could not submit your review. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
      if(userName) {
          setName(userName);
      }
  }, [userName])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enjoying Love.ly?</DialogTitle>
            <DialogDescription>
              Your feedback helps us improve. This review is for future development. If you're happy with the app, let us know!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-8 w-8 cursor-pointer transition-colors",
                    (hoverRating >= star || rating >= star)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
             <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Your Review (Optional)</Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us what you think..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Skip
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
