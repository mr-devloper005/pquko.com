"use client";

import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileActionBarProps {
  website?: string;
}

export function ProfileActionBar({ website }: ProfileActionBarProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "URL copied",
          description: "The URL has been copied to your clipboard.",
        });
        return;
      } catch (err) {
        console.log("Clipboard API failed, trying fallback");
      }
    }
    
    // Fallback: use execCommand
    try {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      
      if (successful) {
        toast({
          title: "URL copied",
          description: "The URL has been copied to your clipboard.",
        });
      } else {
        throw new Error("execCommand failed");
      }
    } catch (err) {
      // Final fallback: show URL in an alert/toast for manual copy
      toast({
        title: "Copy this URL",
        description: url,
        variant: "default",
      });
    }
  };

  return (
    <div className="sticky top-0 z-30 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            onClick={handleLoginRedirect}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            onClick={handleLoginRedirect}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 rounded-full px-4 text-sm font-semibold"
            asChild
          >
            <a
              href={website || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Site
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-full px-4 text-sm font-semibold"
            onClick={handleLoginRedirect}
          >
            Follow
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
