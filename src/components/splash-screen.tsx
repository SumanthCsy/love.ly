"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { LandingPage } from "./landing-page";

export function SplashScreen() {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // Animation duration

    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) {
    return <LandingPage />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background animate-fade-out duration-500 delay-2000">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-75 duration-1000">
        <div className="relative">
          <Heart
            className="h-24 w-24 text-primary animate-pulse"
            fill="currentColor"
          />
        </div>
        <h1 className="text-7xl md:text-8xl font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-400 pb-4">
          Love.ly
        </h1>
        <p className="text-lg text-muted-foreground">
          Your personal chat companion❤️
        </p>
      </div>
    </div>
  );
}
