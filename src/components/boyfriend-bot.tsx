
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { rememberWhatsappConversation } from "@/ai/flows/remember-whatsapp-conversation";
import type { Message } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, Send, Settings, Star } from "lucide-react";
import { ChatMessage, TypingIndicator } from "./chat-message";
import { Skeleton } from "./ui/skeleton";
import { RatingDialog } from "./rating-dialog";

export function BoyfriendBot() {
  const { toast } = useToast();
  const router = useRouter();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hey, I was just thinking about you. What's on your mind?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isResponding, setIsResponding] = React.useState(false);
  const [isComponentLoading, setIsComponentLoading] = React.useState(true);

  const [userName, setUserName] = React.useState("");
  const [botName, setBotName] = React.useState("");
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isRatingOpen, setIsRatingOpen] = React.useState(false);
  const [tempUserName, setTempUserName] = React.useState("");
  const [tempBotName, setTempBotName] = React.useState("");
  
  const viewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedBotName = localStorage.getItem("botName");

    if (storedUserName && storedBotName) {
      setUserName(storedUserName);
      setBotName(storedBotName);
      setTempUserName(storedUserName);
      setTempBotName(storedBotName);
      setIsComponentLoading(false);
    } else {
      router.push("/");
    }

    // Open rating dialog after 1 minute if it hasn't been shown before
    const hasRated = localStorage.getItem('hasRated');
    if (!hasRated) {
        const timer = setTimeout(() => {
            setIsRatingOpen(true);
        }, 60000); // 1 minute
        return () => clearTimeout(timer);
    }
  }, [router]);

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isResponding]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isResponding) return;

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsResponding(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role as 'user' | 'bot',
        content: msg.content,
      }));

      const result = await rememberWhatsappConversation({
        message: input,
        userName: userName,
        botName: botName,
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
       setMessages(prev => prev.slice(0, prev.length -1));
    } finally {
      setIsResponding(false);
    }
  };

  const handleSettingsSave = () => {
    setUserName(tempUserName);
    setBotName(tempBotName);
    localStorage.setItem("userName", tempUserName);
    localStorage.setItem("botName", tempBotName);
    setIsSettingsOpen(false);
    toast({
      title: "Settings saved!",
      description: "Your names have been updated.",
    });
  };

  if (isComponentLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg h-[95vh] max-h-[700px] grid grid-rows-[auto,1fr,auto] rounded-2xl p-4">
          <div className="flex items-center gap-4 border-b pb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <div className="p-4 space-y-4">
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <Skeleton className="h-10 w-3/4 rounded-xl ml-auto" />
             <Skeleton className="h-10 w-1/2 rounded-xl" />
          </div>
          <div className="flex w-full items-center gap-2 pt-4 border-t">
            <Skeleton className="flex-1 h-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Card className="relative w-full max-w-lg h-[95vh] max-h-[700px] grid grid-rows-[auto,1fr,auto] rounded-2xl shadow-lg border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/50">
              <AvatarFallback className="bg-primary/20 text-primary">
                <Heart className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-lg font-headline font-semibold text-foreground">
                {botName}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
          </div>
          <div>
            <Button variant="ghost" size="icon" onClick={() => setIsRatingOpen(true)}>
              <Star className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <ScrollArea className="h-full" viewportRef={viewportRef}>
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} botName={botName} userName={userName} />
              ))}
              {isResponding && <TypingIndicator />}
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
              disabled={isResponding}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 transition-transform active:scale-95"
              disabled={isResponding || !input.trim()}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Change your display name and your partner's name here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userName" className="text-right">
                Your Name
              </Label>
              <Input
                id="userName"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="botName" className="text-right">
                Partner's Name
              </Label>
              <Input
                id="botName"
                value={tempBotName}
                onChange={(e) => setTempBotName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSettingsSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <RatingDialog isOpen={isRatingOpen} onOpenChange={setIsRatingOpen} userName={userName} />
    </>
  );
}
