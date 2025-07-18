"use client";

import * as React from "react";
import { rememberWhatsappConversation } from "@/ai/flows/remember-whatsapp-conversation";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, Send } from "lucide-react";
import { ChatMessage, TypingIndicator } from "./chat-message";

export function BoyfriendBot() {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hey, I was just thinking about you. What's on your mind?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const viewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        sender: msg.role === 'user' ? ('user' as const) : ('bot' as const),
        text: msg.content,
      }));

      const result = await rememberWhatsappConversation({
        message: input,
        conversationHistory,
      });

      if (result.response) {
        const newBotMessage: Message = {
          id: crypto.randomUUID(),
          role: "bot",
          content: result.response,
        };
        setMessages((prev) => [...prev, newBotMessage]);
      } else {
        throw new Error("No response from bot.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Oh no, something went wrong.",
        description: "I'm having a little trouble thinking. Please try again in a moment.",
      });
       const lastUserMessageIndex = messages.length;
       setMessages(prev => prev.slice(0, lastUserMessageIndex));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg h-[95vh] max-h-[700px] grid grid-rows-[auto,1fr,auto] rounded-2xl shadow-lg border-primary/20">
      <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
        <Avatar className="h-12 w-12 border-2 border-primary/50">
          <AvatarFallback className="bg-primary/20 text-primary">
            <Heart className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-lg font-headline font-semibold text-foreground">
            Boyfriend Bot
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-full" viewportRef={viewportRef}>
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center gap-2"
        >
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 resize-none rounded-xl"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as any);
              }
            }}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
