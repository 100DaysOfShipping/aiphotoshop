"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Wand2, Sparkles, Download, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HistoryItem } from "@/lib/types";
import Head from 'next/head';
import Link from 'next/link';

export default function CombinePage() {
  const [imageA, setImageA] = useState<string | null>(null);
  const [imageB, setImageB] = useState<string | null>(null);
  const [combinedImage, setCombinedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  const handleImageASelect = (imageData: string) => {
    setImageA(imageData || null);
    // Reset combined image when a new image is uploaded
    setCombinedImage(null);
  };

  const handleImageBSelect = (imageData: string) => {
    setImageB(imageData || null);
    // Reset combined image when a new image is uploaded
    setCombinedImage(null);
  };

  const handleCombineSubmit = async () => {
    if (!prompt.trim() || !imageA || !imageB) return;
    
    try {
      setLoading(true);
      setError(null);

      // Create a history item with the second image
      const history: HistoryItem[] = [
        {
          role: "user",
          parts: [
            { text: "" },
            { image: imageB }
          ],
        }
      ];

      // Prepare the request data as JSON
      const requestData = {
        prompt: prompt.trim(),
        image: imageA,
        history: history,
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
        throw new Error(errorData.error || "Failed to combine images");
      }

      const data = await response.json();

      if (data.image) {
        // Update the combined image and description
        setCombinedImage(data.image);
        setDescription(data.description || null);
        
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
    // Reset all images and states
    setImageA(null);
    setImageB(null);
    setCombinedImage(null);
    setDescription(null);
    setError(null);
  };

  const handleDownload = () => {
    if (!combinedImage) return;
    
    const link = document.createElement("a");
    link.href = combinedImage;
    link.download = `combined-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>AI Image Combiner | Merge & Blend Images | aiphotoshop.in</title>
        <meta name="description" content="Combine and blend multiple images together with AI. Create unique compositions, mashups, and creative image combinations." />
        <meta name="keywords" content="AI image combiner, image blend, photo merge, AI composition, image fusion" />
      </Head>
      
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4 md:p-8">
        {/* Home navigation button */}
        <div className="fixed top-4 left-4 z-10">
          <Link href="/">
            <Button variant="outline" className="group border border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/5">
              <Home className="h-4 w-4 mr-2 text-primary group-hover:text-primary" />
              Home
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
              <Wand2 className="h-8 w-8 text-primary" />
              AI Image Combiner
            </h1>
            <p className="text-muted-foreground">Upload two images and combine them with AI</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Edit controls */}
          <div className="max-w-4xl mx-auto w-full">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium text-left block">
                Combine Command
              </label>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                <Textarea
                  id="prompt"
                  placeholder="Describe how you want to combine the images..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="resize-none h-[60px] w-full md:w-[48%]"
                  disabled={loading}
                />
                <div className="flex space-x-2 justify-center md:justify-end">
                  <Button 
                    onClick={handleCombineSubmit} 
                    disabled={!prompt.trim() || !imageA || !imageB || loading}
                    className="h-[60px] px-4 bg-primary/90 hover:bg-primary"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Combine Images
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleReset}
                    disabled={!combinedImage || loading}
                    className="h-[60px] px-4 border border-gray-300"
                    variant="outline"
                    size="lg"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  
                  <Button
                    onClick={handleDownload}
                    disabled={!combinedImage || loading}
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

          {/* Main content - Updated layout with inputs on left, output on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Input images */}
            <div className="flex flex-col space-y-8">
              {/* Image A */}
              <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-medium">Image A</h2>
                {!imageA ? (
                  <ImageUpload onImageSelect={handleImageASelect} />
                ) : (
                  <div className="relative rounded-lg overflow-hidden bg-muted/30 border aspect-square flex items-center justify-center">
                    <img 
                      src={imageA} 
                      alt="Image A" 
                      className="max-w-full max-h-full object-contain" 
                    />
                    <button 
                      onClick={() => setImageA(null)} 
                      className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Image B */}
              <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-medium">Image B</h2>
                {!imageB ? (
                  <ImageUpload onImageSelect={handleImageBSelect} />
                ) : (
                  <div className="relative rounded-lg overflow-hidden bg-muted/30 border aspect-square flex items-center justify-center">
                    <img 
                      src={imageB} 
                      alt="Image B" 
                      className="max-w-full max-h-full object-contain" 
                    />
                    <button 
                      onClick={() => setImageB(null)} 
                      className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Combined Result */}
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-xl font-medium">Combined Result</h2>
              {loading ? (
                <div className="relative rounded-lg overflow-hidden bg-muted/30 border aspect-square flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/30 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="text-muted-foreground">Combining your images...</p>
                </div>
              ) : combinedImage ? (
                <div className="relative rounded-lg overflow-hidden bg-muted/30 border aspect-square flex items-center justify-center">
                  <img 
                    src={combinedImage} 
                    alt="Combined Image" 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>
              ) : (imageA && imageB) ? (
                <div className="rounded-lg overflow-hidden bg-muted/10 border border-dashed aspect-square flex flex-col items-center justify-center text-muted-foreground">
                  <Sparkles className="h-8 w-8 mb-2 opacity-50" />
                  <p>Your combined image will appear here</p>
                  <p className="text-sm">Enter a command and click - Combine Images</p>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden bg-muted/10 border border-dashed aspect-square flex flex-col items-center justify-center text-muted-foreground">
                  <Sparkles className="h-8 w-8 mb-2 opacity-50" />
                  <p>Upload both images to get started</p>
                </div>
              )}

              {description && combinedImage && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">AI Description</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
