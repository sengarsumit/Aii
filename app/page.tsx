"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-6xl md:text-7xl lg:text-9xl font-figtree font-bold bg-gradient-to-r from-gray-50 to-[#50D58E] bg-clip-text text-transparent">
          AI Image Generator
        </h1>
          <p className="text-gray-300 text-lg">
            Transform your ideas into stunning images using AI
          </p>
        </div>

        <Card className="p-6 bg-gradient-to-b from-gray-700 to-gray-200">
          <div className="flex gap-4 mb-8">
            <Input
              placeholder="Describe the image you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-black border-gray-600 text-white placeholder-gray-400"
            />
            <Button
              onClick={generateImage}
              disabled={loading || !prompt}
              className="bg-[#50D58E] hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="text-red-400 mb-4 text-center">{error}</div>
          )}

          {image && (
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={image}
                alt={prompt}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {!image && !loading && (
            <div className="aspect-square rounded-lg bg-gray-700/50 flex items-center justify-center">
              <p className="text-gray-400">
                Your generated image will appear here
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}