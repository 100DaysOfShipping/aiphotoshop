"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Wand2, Sparkles, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HistoryItem } from "@/lib/types";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [prompt, setPrompt] = useState("");

  const handleImageSelect = (imageData: string) => {
    setImage(imageData || null);
    // Reset generated image when a new image is uploaded
    setGeneratedImage(null);
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim() || !image) return;
    
    try {
      setLoading(true);
      setError(null);

      // If we have a generated image, use that for editing, otherwise use the uploaded image
      const imageToEdit = generatedImage || image;

      // Prepare the request data as JSON
      const requestData = {
        prompt: prompt.trim(),
        image: imageToEdit,
        history: history.length > 0 ? history : undefined,
      };

      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();

      if (data.image) {
        // Update the generated image and description
        setGeneratedImage(data.image);
        setDescription(data.description || null);

        // Update history locally - add user message
        const userMessage: HistoryItem = {
          role: "user",
          parts: [
            { text: prompt.trim() },
            ...(imageToEdit ? [{ image: imageToEdit }] : []),
          ],
        };

        // Add AI response
        const aiResponse: HistoryItem = {
          role: "model",
          parts: [
            ...(data.description ? [{ text: data.description }] : []),
            ...(data.image ? [{ image: data.image }] : []),
          ],
        };

        // Update history with both messages
        setHistory((prevHistory) => [...prevHistory, userMessage, aiResponse]);
        
        // Clear the prompt
        setPrompt("");
      } else {
        setError("No image returned from API");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error processing request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setDescription(null);
    setError(null);
    setHistory([]);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4 md:p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
            <Wand2 className="h-8 w-8 text-primary" />
            AI Photo Editor
          </h1>
          <p className="text-muted-foreground">Transform your images with simple text commands</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Edit controls - Centered layout with textarea left and buttons right */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium text-left block">
              Edit Command
            </label>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
              <Textarea
                id="prompt"
                placeholder="Describe how you want to edit the image..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none h-[60px] w-full md:w-[48%]"
                disabled={loading}
              />
              <div className="flex space-x-2 justify-center md:justify-end">
                <Button 
                  onClick={handlePromptSubmit} 
                  disabled={!prompt.trim() || loading}
                  className="h-[60px] px-4 bg-primary/90 hover:bg-primary"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Processing...
                    </>
                  ) : generatedImage ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Keep Editing
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Edit Image
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleReset}
                  disabled={!generatedImage || loading}
                  className="h-[60px] px-4 border border-gray-300"
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                
                <Button
                  onClick={handleDownload}
                  disabled={!generatedImage || loading}
                  className="h-[60px] px-4 border border-gray-300"
                  variant="secondary"
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-10"></div>

        {/* Main content */}
        <div className="flex flex-col space-y-8">
          {/* Images section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Original image */}
            <div className="flex flex-col space-y-4">
              {!image ? (
                <ImageUpload onImageSelect={handleImageSelect} />
              ) : (
                <div className="relative rounded-lg overflow-hidden bg-muted/30 border aspect-square flex items-center justify-center">
                  <img 
                    src={image} 
                    alt="Original" 
                    className="max-w-full max-h-full object-contain" 
                  />
                  <button 
                    onClick={() => setImage(null)} 
                    className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              )}
              <h2 className="text-xl font-medium">Original Image</h2>
            </div>

            {/* Right side - Edited image */}
            <div className="flex flex-col space-y-4">
              {loading ? (
                <div className="relative rounded-lg overflow-hidden bg-muted/30 border aspect-square flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/30 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="text-muted-foreground">Transforming your image...</p>
                </div>
              ) : generatedImage ? (
                <div className="relative rounded-lg overflow-hidden bg-muted/30 border aspect-square flex items-center justify-center">
                  <img 
                    src={generatedImage} 
                    alt="Edited" 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>
              ) : image ? (
                <div className="rounded-lg overflow-hidden bg-muted/10 border border-dashed aspect-square flex flex-col items-center justify-center text-muted-foreground">
                  <Sparkles className="h-8 w-8 mb-2 opacity-50" />
                  <p>Your edited image will appear here</p>
                  <p className="text-sm">Enter a command and click "Edit Image"</p>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden bg-muted/10 border border-dashed aspect-square flex flex-col items-center justify-center text-muted-foreground">
                  <Sparkles className="h-8 w-8 mb-2 opacity-50" />
                  <p>Upload an image to get started</p>
                </div>
              )}

              {description && generatedImage && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">AI Description</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              )}
              <h2 className="text-xl font-medium">Edited Image</h2>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
