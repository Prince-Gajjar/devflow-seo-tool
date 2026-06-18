"use client";

import React, { useState } from "react";
import { FileText, Link2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, isValidUrl, formatNumber } from "@/lib/utils";

const guideSteps = [
  {
    title: "Select your input mode",
    description: "Choose 'Paste Text' to input copy-written content directly, or 'Analyze URL' to scan a live website's paragraph tags."
  },
  {
    title: "Specify your target keyword",
    description: "Enter the primary keyword or keyphrase you are optimizing for (e.g. 'coding' or 'SEO tools') to calculate its specific density."
  },
  {
    title: "Run density check and review metrics",
    description: "Review your total word counts, target density meters, Flesch-Kincaid readability, and recommendations for 1, 2, or 3-word terms."
  }
];

// Helper to count syllables in a word (crude approximation for readability scores)
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

// Client-side content analysis function
function analyzeTextContent(text: string, targetKeyword: string) {
  const cleanText = text.trim();
  if (!cleanText || cleanText.length < 10) return null;

  // Split into words, removing punctuation
  const words = cleanText
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const totalWords = words.length;
  if (totalWords === 0) return null;

  // Count unique words
  const uniqueWordsSet = new Set(words);
  const uniqueWords = uniqueWordsSet.size;

  // Target keyword frequency
  const target = targetKeyword.trim().toLowerCase();
  let keywordCount = 0;
  if (target) {
    const targetWords = target.split(/\s+/).filter(Boolean);
    if (targetWords.length === 1) {
      keywordCount = words.filter((w) => w === target).length;
    } else if (targetWords.length > 1) {
      // phrase search
      let count = 0;
      for (let i = 0; i <= totalWords - targetWords.length; i++) {
        let match = true;
        for (let j = 0; j < targetWords.length; j++) {
          if (words[i + j] !== targetWords[j]) {
            match = false;
            break;
          }
        }
        if (match) count++;
      }
      keywordCount = count;
    }
  }

  const density = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;

  // Top Word Frequencies (excluding very common english stop words)
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "to", "for", "in", 
    "on", "at", "by", "with", "of", "from", "that", "this", "these", "those", "i", "you", 
    "he", "she", "it", "they", "we", "us", "them", "your", "my", "our", "their", "his", "her",
    "its", "as", "be", "has", "have", "had", "do", "does", "did", "can", "will", "should"
  ]);

  const wordFreq: Record<string, number> = {};
  words.forEach((w) => {
    if (w.length > 2 && !stopWords.has(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  });

  const top1Words = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({
      phrase: word,
      count,
      density: (count / totalWords) * 100
    }));

  // Top 2-word phrases
  const phrase2Freq: Record<string, number> = {};
  for (let i = 0; i < totalWords - 1; i++) {
    const p = `${words[i]} ${words[i + 1]}`;
    if (!stopWords.has(words[i]) || !stopWords.has(words[i + 1])) {
      phrase2Freq[p] = (phrase2Freq[p] || 0) + 1;
    }
  }

  const top2Phrases = Object.entries(phrase2Freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: (count / totalWords) * 100
    }));

  // Top 3-word phrases
  const phrase3Freq: Record<string, number> = {};
  for (let i = 0; i < totalWords - 2; i++) {
    const p = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    phrase3Freq[p] = (phrase3Freq[p] || 0) + 1;
  }

  const top3Phrases = Object.entries(phrase3Freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: (count / totalWords) * 100
    }));

  // Readability calculation: Flesch-Kincaid
  // Count sentences
  const sentences = cleanText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
  // Syllables
  let totalSyllables = 0;
  words.forEach((w) => {
    totalSyllables += countSyllables(w);
  });

  // Flesch Reading Ease Formula
  const readingEase = Math.round(
    206.835 - 1.015 * (totalWords / sentences) - 84.6 * (totalSyllables / totalWords)
  );

  let readabilityLabel = "";
  if (readingEase >= 90) readabilityLabel = "Very Easy (5th Grade)";
  else if (readingEase >= 80) readabilityLabel = "Easy (6th Grade)";
  else if (readingEase >= 70) readabilityLabel = "Fairly Easy (7th Grade)";
  else if (readingEase >= 60) readabilityLabel = "Standard (8th-9th Grade)";
  else if (readingEase >= 50) readabilityLabel = "Fairly Difficult (High School)";
  else if (readingEase >= 30) readabilityLabel = "Difficult (College)";
  else readabilityLabel = "Very Confusing (College Graduate)";

  return {
    totalWords,
    uniqueWords,
    keywordCount,
    density,
    top1Words,
    top2Phrases,
    top3Phrases,
    readability: {
      score: Math.max(0, Math.min(100, readingEase)),
      label: readabilityLabel
    }
  };
}

export default function KeywordDensityPage() {
  const [activeTab, setActiveTab] = useState("text");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleCheckDensity = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetKeyword.trim()) {
      toast.error("Please enter a target keyword to analyze.");
      return;
    }

    if (activeTab === "url") {
      if (!url.trim()) {
        toast.error("Please enter a URL.");
        return;
      }
      if (!isValidUrl(url)) {
        toast.error("Please enter a valid URL starting with http:// or https://");
        return;
      }

      fetch(`/api/scrape?mode=density&url=${encodeURIComponent(url)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not fetch webpage content.");
          return res.json();
        })
        .then((data) => {
          if (data.error) throw new Error(data.error);
          const result = analyzeTextContent(data.text || "", targetKeyword);
          setAnalysis(result);
          toast.success("Webpage scanned and analyzed successfully!");
        })
        .catch((err) => {
          toast.error(err.message || "Failed to scan webpage.");
          setAnalysis(null);
        })
        .finally(() => {
          setIsLoading(false);
        });

    } else {
      // Text mode
      if (!text.trim() || text.trim().length < 100) {
        toast.error("Pasted text content must be at least 100 characters long.");
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      setTimeout(() => {
        const result = analyzeTextContent(text, targetKeyword);
        setAnalysis(result);
        setIsLoading(false);
        toast.success("Text analyzed successfully!");
      }, 1000);
    }
  };

  const getDensityColor = (density: number) => {
    if (density < 1.0) return "bg-muted";
    if (density <= 3.0) return "bg-primary";
    if (density <= 5.0) return "bg-warning";
    return "bg-destructive";
  };

  const getRecommendationBadge = (density: number) => {
    if (density === 0) return { label: "Underused", style: "bg-muted text-muted-foreground" };
    if (density < 1.0) return { label: "Optimal (Under)", style: "bg-primary/10 text-primary" };
    if (density <= 3.0) return { label: "Optimal", style: "bg-primary/10 text-primary" };
    if (density <= 5.0) return { label: "Borderline High", style: "bg-warning/10 text-warning" };
    return { label: "Overused (Stuffing)", style: "bg-destructive/10 text-destructive" };
  };

  return (
    <ToolLayout toolId="keyword-density" guideSteps={guideSteps}>
      
      <Tabs defaultValue="text" value={activeTab} onValueChange={(val) => {
        setActiveTab(val);
        setHasSearched(false);
        setAnalysis(null);
      }}>
        
        {/* Tab Selection */}
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="text" className="gap-1.5">
              <FileText className="h-4 w-4" />
              Paste Text
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-1.5">
              <Link2 className="h-4 w-4" />
              Analyze URL
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Input Card */}
        <Card className="border-card-border/60 bg-card/40 shadow-md">
          <CardContent className="p-6">
            <form onSubmit={handleCheckDensity} className="space-y-4">
              
              {/* URL Tab Content */}
              <TabsContent value="url" className="m-0">
                <div className="space-y-1.5">
                  <label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Webpage URL
                  </label>
                  <Input
                    id="url"
                    placeholder="https://example.com/blog-post"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </TabsContent>

              {/* Text Tab Content */}
              <TabsContent value="text" className="m-0">
                <div className="space-y-1.5">
                  <label htmlFor="content" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Paste content to analyze (Min 100 characters)
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Paste your blog article, copy, or text content here to examine keyword weights..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>Characters: {text.length} | Words: {text.split(/\s+/).filter(Boolean).length}</span>
                  </div>
                </div>
              </TabsContent>

              {/* Target Keyword Input */}
              <div className="space-y-1.5">
                <label htmlFor="target" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Target Keyword / Phrase
                </label>
                <Input
                  id="target"
                  placeholder="e.g. digital marketing"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Check Keyword Density
              </Button>

            </form>
          </CardContent>
        </Card>

      </Tabs>

      {/* Loading Skeleton */}
      {isLoading && <LoadingSkeleton type="generic" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && analysis && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Summary Row Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Total Words</span>
                <h3 className="text-2xl font-black text-foreground">{formatNumber(analysis.totalWords)}</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Unique Words</span>
                <h3 className="text-2xl font-black text-foreground">{formatNumber(analysis.uniqueWords)}</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Keyword Matches</span>
                <h3 className="text-2xl font-black text-primary">{formatNumber(analysis.keywordCount)}</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Density Percentage</span>
                <h3 className={cn(
                  "text-2xl font-black",
                  analysis.density > 5 ? "text-rose-500" : analysis.density >= 1 ? "text-primary" : "text-muted-foreground"
                )}>
                  {analysis.density.toFixed(2)}%
                </h3>
              </CardContent>
            </Card>

          </div>

          {/* Target Density Progress Bar */}
          <Card className="bg-card/30 border-card-border/60 p-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                Keyword Weight: <strong className="text-primary font-bold">"{targetKeyword}"</strong>
              </span>
              <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                Status: 
                <span className={cn("px-2 py-0.5 rounded text-xs font-bold", getRecommendationBadge(analysis.density).style)}>
                  {getRecommendationBadge(analysis.density).label}
                </span>
              </span>
            </div>
            
            <Progress 
              value={analysis.density * 15} // scale progress bar visual weight
              indicatorClassName={getDensityColor(analysis.density)} 
            />

            {/* Density scale details */}
            <div className="grid grid-cols-4 gap-2 text-[10px] md:text-xs text-muted-foreground font-semibold text-center pt-2">
              <div className="border-t border-card-border pt-2"><span className="text-muted-foreground font-bold">&lt; 1%</span> Underused</div>
              <div className="border-t border-primary/20 pt-2"><span className="text-primary font-bold">1% - 3%</span> Optimal</div>
              <div className="border-t border-warning/20 pt-2"><span className="text-warning font-bold">3% - 5%</span> Warning</div>
              <div className="border-t border-destructive/20 pt-2"><span className="text-destructive font-bold">&gt; 5%</span> Stuffing</div>
            </div>
          </Card>

          {/* Readability & Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Readability Card */}
            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  Readability Score
                </span>
                <h4 className="text-xl font-bold text-foreground">Flesch-Kincaid index</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Measures readability on a 1-100 ease scale. Higher scores reflect simple vocabularies and sentence links.
                </p>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-primary">{analysis.readability.score}</span>
                  <span className="text-sm font-semibold text-muted-foreground mb-1">/ 100</span>
                </div>
                <span className="text-sm font-bold text-foreground block">
                  {analysis.readability.label}
                </span>
              </div>
            </Card>

            {/* Word Frequencies Lists (1, 2, 3 word phrases) */}
            <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2">
              <h4 className="font-bold text-lg text-foreground mb-4">Top Word & Phrase Weights</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* 1-Word Column */}
                <div className="space-y-3">
                  <h5 className="text-xs font-extrabold uppercase text-accent border-b border-card-border/40 pb-1.5">1-Word Terms</h5>
                  <ul className="space-y-2 text-xs">
                    {analysis.top1Words.map((item: any, i: number) => (
                      <li key={i} className="flex justify-between items-center bg-card-border/10 p-1.5 rounded">
                        <span className="font-semibold text-foreground truncate max-w-[70px]">{item.phrase}</span>
                        <span className="text-muted-foreground font-mono">{item.density.toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2-Word Column */}
                <div className="space-y-3">
                  <h5 className="text-xs font-extrabold uppercase text-accent border-b border-card-border/40 pb-1.5">2-Word Phrases</h5>
                  <ul className="space-y-2 text-xs">
                    {analysis.top2Phrases.map((item: any, i: number) => (
                      <li key={i} className="flex justify-between items-center bg-card-border/10 p-1.5 rounded">
                        <span className="font-semibold text-foreground truncate max-w-[90px]">{item.phrase}</span>
                        <span className="text-muted-foreground font-mono">{item.density.toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3-Word Column */}
                <div className="space-y-3">
                  <h5 className="text-xs font-extrabold uppercase text-accent border-b border-card-border/40 pb-1.5">3-Word Phrases</h5>
                  <ul className="space-y-2 text-xs">
                    {analysis.top3Phrases.map((item: any, i: number) => (
                      <li key={i} className="flex justify-between items-center bg-card-border/10 p-1.5 rounded">
                        <span className="font-semibold text-foreground truncate max-w-[90px]">{item.phrase}</span>
                        <span className="text-muted-foreground font-mono">{item.density.toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </Card>

          </div>

        </div>
      )}

    </ToolLayout>
  );
}
