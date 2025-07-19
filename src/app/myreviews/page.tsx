
// Allow using client-side functionality
"use client";

import * as React from "react";
import type { Review } from "@/app/api/reviews/route"; // Import the Review type
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, LogIn, Star } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// Component to display a single review
function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-lg">{review.name}</CardTitle>
                 <CardDescription>
                    {format(new Date(review.createdAt), "MMMM d, yyyy")}
                </CardDescription>
            </div>
            <div className="flex items-center gap-1">
                <span className="font-bold text-lg">{review.rating}</span>
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{review.review || "No review text submitted."}</p>
      </CardContent>
    </Card>
  );
}

// Main component for the reviews page
export default function MyReviewsPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isFetchingReviews, setIsFetchingReviews] = React.useState(false);

  // Handle password submission for authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This is a simple client-side check.
    // In a real-world app, you'd want to verify this on the server.
    if (password === "love.ly@admin0112") {
      toast({ title: "Access Granted", description: "Welcome, Admin!" });
      setIsAuthenticated(true);
      fetchReviews();
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "The passkey you entered is incorrect.",
      });
      setIsAuthenticated(false);
    }
    setIsLoading(false);
    setPassword("");
  };

  // Fetch reviews from the API
  const fetchReviews = async () => {
    setIsFetchingReviews(true);
    try {
      const response = await fetch("/api/reviews");
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch reviews.",
      });
    } finally {
      setIsFetchingReviews(false);
    }
  };

  // Render loading state for reviews
  if (isAuthenticated && isFetchingReviews) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-8">
        <h1 className="text-4xl font-headline font-bold mb-8">App Reviews</h1>
        <div className="w-full max-w-2xl space-y-4">
            {[...Array(3)].map((_, i) => (
                 <Card key={i}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-12" />
                        </div>
                         <Skeleton className="h-4 w-48 mt-1" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    );
  }

  // Render the authenticated view with reviews
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-8">
        <h1 className="text-4xl font-headline font-bold mb-8">App Reviews</h1>
        <div className="w-full max-w-2xl space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review._id.toString()} review={review} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No reviews submitted yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Render the login form if not authenticated
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound /> Admin Access
            </CardTitle>
            <CardDescription>
              Enter the admin passkey to view user reviews.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="password">Passkey</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Log In"}
              {!isLoading && <LogIn className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
