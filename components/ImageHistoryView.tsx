"use client";

import { HistoryItem } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageHistoryViewProps {
  history: HistoryItem[];
}

export function ImageHistoryView({ history }: ImageHistoryViewProps) {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border">
      <div className="p-4 space-y-4">
        {history.map((item, index) => (
          <div
            key={index}
            className={`flex ${
              item.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                item.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {item.parts.map((part, partIndex) => (
                <div key={partIndex}>
                  {part.text && <p className="text-sm">{part.text}</p>}
                  {part.image && (
                    <img
                      src={part.image}
                      alt="History image"
                      className="mt-2 max-h-[150px] rounded-md object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 