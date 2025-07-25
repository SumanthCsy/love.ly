"use client";

import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  userName: string;
  botName: string;
}

export function ChatMessage({ message, userName, botName }: ChatMessageProps) {
  const { role, content } = message;
  const isBot = role === "bot";

  return (
    <div
      className={cn(
        "flex items-end gap-2 animate-in fade-in-25",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarFallback className="bg-accent/50 text-accent-foreground">
            <Heart className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 text-foreground shadow-sm break-words",
          isBot
            ? "bg-accent/80 rounded-bl-none"
            : "bg-primary/80 text-primary-foreground rounded-br-none"
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
       {!isBot && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarFallback className="bg-primary/50 text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

interface TypingIndicatorProps {
    botIcon?: React.ReactNode;
}

export function TypingIndicator({ botIcon }: TypingIndicatorProps) {
  return (
    <div className="flex items-end gap-2 justify-start">
      <Avatar className="h-8 w-8 self-start">
        <AvatarFallback className="bg-accent/50 text-accent-foreground">
          {botIcon || <Heart className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center space-x-1 rounded-2xl bg-accent/80 rounded-bl-none px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"></span>
      </div>
    </div>
  );
}
