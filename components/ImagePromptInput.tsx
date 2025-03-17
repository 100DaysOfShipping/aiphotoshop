"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ImagePromptInputProps {
  onSubmit: (prompt: string) => Promise<void>;
  isEditing: boolean;
  isLoading: boolean;
}

export function ImagePromptInput({ 
  onSubmit, 
  isEditing, 
  isLoading 
}: ImagePromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      await onSubmit(prompt.trim());
      setPrompt("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Textarea
        placeholder={isEditing 
          ? "Describe how you want to edit the image..." 
          : "Describe the image you want to create..."}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="pr-12 resize-none min-h-[80px] focus-visible:ring-1 focus-visible:ring-primary"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!prompt.trim() || isLoading}
        className="absolute right-2 bottom-2 h-8 w-8"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
} 