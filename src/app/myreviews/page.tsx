
"use client";

import * as React from "react";
import type { Review } from "@/app/api/reviews/route"; 
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
import { KeyRound, LogIn, Star, Frown } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-lg">{review.name}</CardTitle>
                 <CardDescription>
                    {review.createdAt ? format(new Date(review.createdAt), "MMMM d, yyyy") : "Date not available"}
                </CardDescription>
            </div>
            <div className="flex items-center gap-1">
                <span className="font-bold text-lg">{review.rating}</span>
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
        </div>
      </CardHeader>
      {review.review && (
        <CardContent>
          <p className="text-muted-foreground">{review.review}</p>
        </CardContent>
      )}
    </Card>
  );
}

export default function MyReviewsPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isFetchingReviews, setIsFetchingReviews] = React.useState(true); // Start fetching immediately
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (password === "love.ly@admin0112") {
      toast({ title: "Access Granted", description: "Welcome, Admin!" });
      setIsAuthenticated(true);
      // Reviews are already being fetched, no need to call fetchReviews() here
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

  React.useEffect(() => {
    const fetchReviews = async () => {
      setIsFetchingReviews(true);
      setError(null);
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || "Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        console.error(error);
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error Fetching Reviews",
          description: errorMessage,
        });
      } finally {
        setIsFetchingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  const renderContent = () => {
    if (isFetchingReviews) {
      return (
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
      );
    }

    if (error) {
       return (
        <Card className="w-full max-w-2xl text-center p-8">
            <Frown className="mx-auto h-12 w-12 text-destructive" />
            <CardTitle className="mt-4">Failed to Load Reviews</CardTitle>
            <CardDescription className="mt-2">
                There was an error fetching the reviews.
            </CardDescription>
            <CardContent className="mt-4 text-sm text-muted-foreground">
                <p><strong>Error details:</strong> {error}</p>
            </CardContent>
        </Card>
       );
    }
    
    if (reviews.length > 0) {
      return (
        <div className="w-full max-w-2xl space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      );
    }
    
    return (
      <Card className="w-full max-w-2xl text-center p-8">
            <CardTitle>No Reviews Yet</CardTitle>
            <CardDescription className="mt-2">
               When users submit reviews, they will appear here.
            </CardDescription>
        </Card>
    );
  };


  if (!isAuthenticated) {
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-8">
        <h1 className="text-4xl font-headline font-bold mb-8">App Reviews</h1>
        {renderContent()}
    </div>
  );
}
