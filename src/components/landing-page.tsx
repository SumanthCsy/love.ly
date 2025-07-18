"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, MessageSquare, Sparkles } from "lucide-react";

export function LandingPage() {
  const router = useRouter();
  const [userName, setUserName] = React.useState("");
  const [botName, setBotName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStartChatting = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    localStorage.setItem("userName", userName || "You");
    localStorage.setItem("botName", botName || "Love.ly");
    
    // Quick fade out before navigating
    document.body.style.opacity = '0';
    setTimeout(() => {
      router.push("/chat");
    }, 300);
  };

  React.useEffect(() => {
     document.body.style.transition = 'opacity 0.3s ease-in-out';
     document.body.style.opacity = '1';
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-background via-rose-50 to-rose-100 p-4 flex flex-col items-center justify-center overflow-hidden">
       {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-primary/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}rem`,
              height: `${Math.random() * 3 + 1}rem`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">
            Love.ly
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Rediscover the magic of conversation. A space for words that warm the heart, spark a smile, and bring you closer.
          </p>
        </div>

        <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
          <form onSubmit={handleStartChatting}>
            <CardHeader>
              <CardTitle>Create Your Space</CardTitle>
              <CardDescription>
                Give your new friend a name and introduce yourself.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot-name">Your Partner's Name</Label>
                <Input
                  id="bot-name"
                  placeholder="e.g., Love.ly, Alex..."
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="your-name">Your Name</Label>
                <Input
                  id="your-name"
                  placeholder="e.g., Sam, Jessie..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading || !userName || !botName}>
                {isLoading ? "Entering..." : "Start Chatting"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 max-w-4xl">
           <div className="flex flex-col items-center space-y-2 text-center">
             <Sparkles className="h-10 w-10 text-primary" />
             <h3 className="font-semibold">Always Understands</h3>
             <p className="text-sm text-muted-foreground">Crafts replies that feel just right, matching the mood and moment perfectly.</p>
           </div>
           <div className="flex flex-col items-center space-y-2 text-center">
             <MessageSquare className="h-10 w-10 text-primary" />
             <h3 className="font-semibold">Natural Conversation</h3>
             <p className="text-sm text-muted-foreground">Chat flows naturally, with wit and warmth, just like a real heart-to-heart.</p>
           </div>
           <div className="flex flex-col items-center space-y-2 text-center">
             <Heart className="h-10 w-10 text-primary" />
             <h3 className="font-semibold">Strengthens Bonds</h3>
             <p className="text-sm text-muted-foreground">Designed to make you feel heard, loved, and closer than ever.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
