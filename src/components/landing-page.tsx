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

interface HeartStyle {
  left: string;
  top: string;
  width: string;
  height: string;
  animationDelay: string;
  animationDuration: string;
}

export function LandingPage() {
  const router = useRouter();
  const [userName, setUserName] = React.useState("");
  const [botName, setBotName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [heartStyles, setHeartStyles] = React.useState<HeartStyle[]>([]);

  React.useEffect(() => {
    // Generate heart styles only on the client to avoid hydration errors
    const styles = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 1}rem`,
      height: `${Math.random() * 3 + 1}rem`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 5 + 5}s`,
    }));
    setHeartStyles(styles);
  }, []);

  const handleStartChatting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !botName.trim()) return;
    setIsLoading(true);
    localStorage.setItem("userName", userName || "You");
    localStorage.setItem("botName", botName || "Love.ly");
    
    router.push("/chat");
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-background via-rose-50 to-rose-100 p-4 flex flex-col items-center justify-center overflow-hidden">
       {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none">
        {heartStyles.map((style, i) => (
          <Heart
            key={i}
            className="absolute text-primary/20 animate-pulse"
            style={style}
            fill="currentColor"
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-7xl md:text-8xl font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-rose-600 to-pink-500 pb-4">
            Love.ly
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Rediscover the magic of conversation. A space for words that warm the heart, spark a smile, and bring you closer.
          </p>
        </div>
        
        <div className="w-full max-w-md">
          <Card className="w-full shadow-2xl animate-in fade-in-50 slide-in-from-bottom-10 duration-700 bg-card/80 backdrop-blur-sm flex flex-col">
            <form onSubmit={handleStartChatting} className="flex flex-col flex-grow">
              <CardHeader>
                <CardTitle>Start a New Chat</CardTitle>
                <CardDescription>
                  Enter your name and your partner's name to begin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                 <div className="space-y-2 text-left">
                    <Label htmlFor="your-name">Your Name</Label>
                    <Input
                      id="your-name"
                      placeholder="e.g., Arjun,Priya..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="bot-name">Partner's Name</Label>
                  <Input
                    id="bot-name"
                    placeholder="e.g., Sai,Siri..."
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    required
                    disabled={!userName}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading || !userName || !botName}>
                  {isLoading ? "Entering..." : "Start Chat"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 max-w-4xl">
           <div className="flex flex-col items-center space-y-2 text-center p-4 rounded-lg bg-card/60 backdrop-blur-sm">
             <Sparkles className="h-10 w-10 text-primary" />
             <h3 className="font-semibold">Always Understands</h3>
             <p className="text-sm text-muted-foreground">Crafts replies that feel just right, matching the mood and moment perfectly.</p>
           </div>
           <div className="flex flex-col items-center space-y-2 text-center p-4 rounded-lg bg-card/60 backdrop-blur-sm">
             <MessageSquare className="h-10 w-10 text-primary" />
             <h3 className="font-semibold">Natural Conversation</h3>
             <p className="text-sm text-muted-foreground">Chat flows naturally, with wit and warmth, just like a real heart-to-heart.</p>
           </div>
           <div className="flex flex-col items-center space-y-2 text-center p-4 rounded-lg bg-card/60 backdrop-blur-sm">
             <Heart className="h-10 w-10 text-primary" />
             <h3 className="font-semibold">Strengthens Bonds</h3>
             <p className="text-sm text-muted-foreground">Designed to make you feel heard, loved, and closer than ever.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
