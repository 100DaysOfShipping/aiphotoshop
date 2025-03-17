"use client";

import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryItem } from "@/lib/types";
import { ImageHistoryView } from "@/components/ImageHistoryView";

interface ImageResultDisplayProps {
  imageUrl: string;
  description: string | null;
  onReset: () => void;
  conversationHistory: HistoryItem[];
}

export function ImageResultDisplay({
  imageUrl,
  description,
  onReset,
  conversationHistory,
}: ImageResultDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {conversationHistory.length > 0 && (
        <ImageHistoryView history={conversationHistory} />
      )}
      
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-2xl rounded-lg overflow-hidden shadow-md">
          <img
            src={imageUrl}
            alt="Generated image"
            className="w-full h-auto object-contain"
          />
          
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button
              onClick={handleDownload}
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          </div>
        </div>
        
        {description && (
          <div className="text-sm text-muted-foreground max-w-2xl text-center">
            {description}
          </div>
        )}
        
        <div className="flex justify-center space-x-2">
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
} 