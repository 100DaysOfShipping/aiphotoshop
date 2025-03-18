"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Wand2, Sparkles, Download, RotateCcw, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryItem } from "@/lib/types";
import Head from 'next/head';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function WatermarkRemoverPage() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded prompt for watermark removal
  const WATERMARK_REMOVAL_PROMPT = "Remove any watermarks, logos, text overlays from this image. Make the removal seamless and natural looking, ensuring the background is properly reconstructed.";

  const handleImageSelect = (imageData: string) => {
    setImage(imageData || null);
    // Reset processed image when a new image is uploaded
    setProcessedImage(null);
  };

  const handleRemoveWatermark = async () => {
    if (!image) return;
    
    try {
      setLoading(true);
      setError(null);

      // Prepare the request data as JSON
      const requestData = {
        prompt: WATERMARK_REMOVAL_PROMPT,
        image: image,
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
        throw new Error(errorData.error || "Failed to remove watermark");
      }

      const data = await response.json();

      if (data.image) {
        // Update the processed image and description
        setProcessedImage(data.image);
        setDescription(data.description || null);
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
    setImage(null);
    setProcessedImage(null);
    setDescription(null);
    setError(null);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `watermark-removed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>AI Watermark Remover | Remove Watermarks with AI | aiphotoshop.in</title>
        <meta name="description" content="Remove watermarks, logos, and text overlays from your images with AI. Get clean, watermark-free images instantly." />
        <meta name="keywords" content="watermark remover, logo removal, text removal, image cleaning, AI photo editor" />
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
              <Eraser className="h-8 w-8 text-primary" />
              AI Watermark Remover
            </h1>
            <p className="text-muted-foreground">Remove watermarks, logos, and text overlays from your images</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="max-w-4xl mx-auto w-full mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                onClick={handleRemoveWatermark} 
                disabled={!image || loading}
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
                    <Eraser className="mr-2 h-4 w-4" />
                    Remove Watermark
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleReset}
                disabled={!image || loading}
                className="h-[60px] px-4 border border-gray-300"
                variant="outline"
                size="lg"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              
              <Button
                onClick={handleDownload}
                disabled={!processedImage || loading}
                className="h-[60px] px-4 border border-gray-300"
                variant="secondary"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

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
              <h2 className="text-xl font-medium">Image with Watermark</h2>
            </div>

            {/* Right side - Edited image */}
            <div className="flex flex-col space-y-4">
              {loading ? (
                <div className="relative rounded-lg overflow-hidden bg-muted/30 border aspect-square flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/30 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="text-muted-foreground">Removing watermark...</p>
                </div>
              ) : processedImage ? (
                <div className="relative rounded-lg overflow-hidden bg-muted/30 border aspect-square flex items-center justify-center">
                  <img 
                    src={processedImage} 
                    alt="Watermark Removed" 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>
              ) : image ? (
                <div className="rounded-lg overflow-hidden bg-muted/10 border border-dashed aspect-square flex flex-col items-center justify-center text-muted-foreground">
                  <Eraser className="h-8 w-8 mb-2 opacity-50" />
                  <p>Cleaned image will appear here</p>
                  <p className="text-sm">Click "Remove Watermark" to process</p>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden bg-muted/10 border border-dashed aspect-square flex flex-col items-center justify-center text-muted-foreground">
                  <Eraser className="h-8 w-8 mb-2 opacity-50" />
                  <p>Upload an image to get started</p>
                </div>
              )}

              {description && processedImage && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">AI Description</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              )}
              <h2 className="text-xl font-medium">Clean Image</h2>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
