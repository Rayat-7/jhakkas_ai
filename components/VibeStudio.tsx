"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Copy, Check, Play, AlertTriangle, RefreshCw, X, Type } from "lucide-react";
import { convertImageToBase64, isValidImageFile } from "@/src/utils/image-helpers";

type Mood = "Funny" | "Sarcastic-Cool" | "Aesthetic" | "Minimal" | "Shayeri-Style" | "Romantic"|"Egoistic" |"Dark" |"Playful" |"Humorous";
type Language = "English" | "Banglish" | "Urdu" | "Bangla" | "Hindi";


interface GeneratedContent {
  id: string; // Added stable ID
  captions: string[];
  songs: {
    title: string;
    artist: string;
    lyric: string;
    youtube_link?: string;
  }[];
}

const FUNNY_LOADER_TEXTS = [
  "Analyzing your swag... 😎",
  "সেরা ক্যাপশন খুঁজে বের করার মিশন চলছে... 🧐",
  "রোমান্টিক লাইন খুঁজতে গিয়ে বুঝলাম— তুমি ছাড়া সব লাইনই ফাঁকা .🙃",
  "Cooking some spicy content... 🌶️",
  "Adding some jhakkas masala... ✨",
  "Almost there জনাব! 🚀"
];

export default function VibeStudio() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [focus, setFocus] = useState("");
  
  // Multi-select State
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>(["Aesthetic"]);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(["English"]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(FUNNY_LOADER_TEXTS[0]);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<{historyIndex: number, itemIndex: number} | null>(null);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeQuery, setYoutubeQuery] = useState("");
  const [activeYoutubeLink, setActiveYoutubeLink] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const moods: Mood[] = ["Funny", "Sarcastic-Cool", "Aesthetic", "Minimal", "Shayeri-Style", "Romantic","Egoistic","Dark","Playful","Humorous"];

  const languages: Language[] = ["English", "Banglish", "Bangla", "Urdu", "Hindi"];

  // Regeneration Cooldown State
  const [canRegenerate, setCanRegenerate] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  // Loader Text Cycling Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingText(prev => {
          const currentIndex = FUNNY_LOADER_TEXTS.indexOf(prev);
          const nextIndex = (currentIndex + 1) % FUNNY_LOADER_TEXTS.length;
          return FUNNY_LOADER_TEXTS[nextIndex];
        });
      }, 3000);
    } else {
      setLoadingText(FUNNY_LOADER_TEXTS[0]);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const getYoutubeEmbedUrl = (query: string, link?: string) => {
    // Try to extract video ID from link first
    if (link) {
      const videoIdMatch = link.match(/(?:v=|\/)([\w-]{11})(?:\?|&|$)/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1`;
      }
    }
    // Fallback to search if no valid ID found
    return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
  };


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    } else {
      setCanRegenerate(true);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRegenerate = () => {
    if (!canRegenerate) return;
    setCanRegenerate(false);
    setCooldown(60); // 1 minute cooldown
    handleGenerate();
  };

  const toggleSelection = <T extends string>(item: T, current: T[], setter: (val: T[]) => void) => {
    if (current.includes(item)) {
       if (current.length > 1) setter(current.filter(i => i !== item));
    } else {
       if (current.length < 2) setter([...current, item]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setError("Please upload a valid image (JPEG, PNG, WebP, or HEIC)");
      return;
    }

    setImageFile(file);
    // For HEIC, we might not get a preview immediately if we just use createObjectURL on the raw file
    // But for simplicity/speed, we show the raw file if supported by browser, or just a placeholder
    // The actual conversion happens during generation.
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setError("");
    setHistory([]); 
  };

  const handleGenerate = async () => {
    if (!imageFile) {
        setError("Please upload an image first.");
        return;
    }
    if (!focus.trim()) {
        setError("Please add a focus point.");
        return;
    }

    setIsLoading(true);
    setError("");
    // Don't clear results immediately on regenerate so user sees old ones until new ones arrive
    // setResults(null); 

    try {
      const base64Image = await convertImageToBase64(imageFile);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            image: base64Image, 
            focus, 
            mood: selectedMoods, 
            language: selectedLanguages 
        }),
      });

      if (!response.ok) throw new Error("Failed to generate content");
      const data = await response.json();
      // Ensure the ID is absolutely unique and never empty
      const uniqueId = `vibe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const resultWithId = { ...data, id: uniqueId };
      setHistory(prev => [resultWithId, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, historyIndex: number, itemIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex({ historyIndex, itemIndex });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const openYoutubePreview = (song: string, artist: string, link?: string) => {
    setYoutubeQuery(`${song} ${artist}`);
    setActiveYoutubeLink(link || `https://www.youtube.com/results?search_query=${encodeURIComponent(song + " " + artist)}`);
    setShowYoutubeModal(true);
  };

  // Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div id="vibe-studio" className="relative w-full min-h-screen bg-black text-white py-20 px-6 lg:px-12 border-t border-white/10">
       <div className="max-w-[1600px] mx-auto">
        
       {history.length === 0 && (
            <div className="mb-12 text-center space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Jhakkas <span className="text-rose-500 italic">AI</span> Studio
            </h2>
            <p className="text-white/60 text-sm md:text-base">Upload photo • Pick Vibe • Go Viral</p>
            </div>
        )}

        <div className={`grid gap-8 transition-all duration-500 ${history.length > 0 ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1 max-w-2xl mx-auto"}`}>
          
          {/* LEFT PANEL: INPUT FORM */}
          <div className={`transition-all duration-500 ${history.length > 0 ? "lg:col-span-4 lg:sticky lg:top-8 self-start" : "w-full"}`}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
                
                {/* Compact Image Upload */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-xl overflow-hidden border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-white/5 transition cursor-pointer group aspect-video ${imagePreview ? 'border-none' : ''}`}
                >
                    {imagePreview && !imageFile?.name.toLowerCase().endsWith('.heic') && !imageFile?.name.toLowerCase().endsWith('.heif') ? (
                        <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <span className="text-white font-medium flex items-center gap-2 text-sm"><RefreshCw className="w-4 h-4"/> Change Photo</span>
                            </div>
                        </>
                    ) : imageFile ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-white/5">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3 text-blue-400">
                                <span className="font-bold text-xs">HEIC</span>
                            </div>
                            <p className="font-medium text-white truncate max-w-[80%]">{imageFile.name}</p>
                            <p className="text-xs text-white/40 mt-1">Preview not available</p>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <span className="text-white font-medium flex items-center gap-2 text-sm"><RefreshCw className="w-4 h-4"/> Change Photo</span>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                            <Upload className="w-6 h-6 text-white/40 mb-2 group-hover:text-blue-400 transition" />
                            <p className="font-semibold text-sm">Upload Photo</p>
                            <p className="text-[10px] text-white/40 mt-1">JPG, PNG, HEIC</p>
                        </div>
                    )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" onChange={handleImageUpload} className="hidden" />

                {/* Form Controls */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Focus Point</label>
                        <input
                            type="text"
                            value={focus}
                            onChange={(e) => setFocus(e.target.value)}
                            placeholder="e.g. My sneakers, The sunset..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition text-sm"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                             <label className="block text-xs font-medium text-white/40 uppercase tracking-widest"> <span className="text-cyan-500">Mood</span></label>
                             <span className="text-[10px] text-cyan-500">Max 2</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                             {moods.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => toggleSelection(m, selectedMoods, setSelectedMoods)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition active:scale-95 ${selectedMoods.includes(m) ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                                >
                                    {m}
                                </button>
                             ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                             <label className="block text-xs font-medium text-cyan-500 uppercase tracking-widest">Language</label>
                             <span className="text-[10px] text-cyan-500">Max 2</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition active:scale-95 ${selectedLanguages.includes(lang) ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading || !imageFile} 
                        className="w-full py-4 bg-gradient-to-l from-[#f97316] via-[#e11d48] to-[#ef4444] text-white font-bold rounded-xl hover:bg-rose-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                <span className="animate-pulse">{loadingText}</span>
                            </div>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> Generate jhakkas captions
                            </>
                        )}
                    </button>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </div>
            </div>
          </div>

          {/* RIGHT PANEL: RESULTS */}
          {history.length > 0 && (
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="lg:col-span-8 space-y-12"
            >
                {/* Header with Regenerate Button */}
                <div className="flex justify-end sticky top-0 z-10 py-2 bg-black/50 backdrop-blur-sm">
                    <button
                        onClick={handleRegenerate}
                        disabled={!canRegenerate || isLoading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
                    >
                         <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                         {isLoading ? "Generating..." : canRegenerate ? "Regenerate Vibe" : `Wait ${cooldown}s`}
                    </button>
                </div>

                <div className="space-y-12">
                    <AnimatePresence mode="popLayout">
                    {history.map((result, hIdx) => (
                        <motion.div 
                            key={`vibe-result-${result.id || hIdx}`}
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={`space-y-6 ${hIdx > 0 ? 'pt-12 border-t border-white/10' : ''}`}
                        >
                            {hIdx > 0 && (
                                <div className="flex items-center gap-4">
                                    <div className="h-[1px] flex-1 bg-white/10"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Previous Result #{history.length - hIdx}</span>
                                    <div className="h-[1px] flex-1 bg-white/10"></div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Captions Column */}
                                <div className="space-y-4">
                                    <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 mb-4 md:mb-6 text-white/80">
                                        <Type className="w-5 h-5 text-blue-500" /> Viral Captions {hIdx === 0 && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase ml-2 tracking-widest">New</span>}
                                    </h3>
                                    <div className="space-y-4">
                                        {result.captions.map((caption, idx) => (
                                            <div key={idx} className="group relative p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition hover:border-white/20">
                                                <p className="text-base md:text-lg font-medium leading-relaxed pr-8 font-mono opacity-90">{caption}</p>
                                                <button 
                                                    onClick={() => copyToClipboard(caption, hIdx, idx)}
                                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white text-white/50 hover:text-black transition"
                                                    title="Copy"
                                                >
                                                    {copiedIndex?.historyIndex === hIdx && copiedIndex?.itemIndex === idx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Songs Column */}
                                <div className="space-y-4">
                                    <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 mb-4 md:mb-6 text-white/80">
                                        <Play className="w-5 h-5 text-green-500" /> Vibe Check
                                    </h3>
                                    <div className="space-y-4">
                                        {result.songs.map((song, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition hover:border-white/20 group">
                                                <button 
                                                    onClick={() => openYoutubePreview(song.title, song.artist, song.youtube_link)}
                                                    className="mt-1 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition shrink-0 border border-white/10"
                                                >
                                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                                </button>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-bold text-base md:text-lg truncate">{song.title}</h4>
                                                    <p className="text-white/60 text-xs md:text-sm truncate">{song.artist}</p>
                                                    <p className="text-xs md:text-sm text-blue-400 mt-2 italic pl-3 border-l-2 border-blue-500/30 line-clamp-2 md:line-clamp-none">
                                                        &quot;{song.lyric}&quot;
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>

                 {/* Warning Banner (Bottom) */}
                 <motion.div variants={item} className="flex items-center justify-center gap-2 p-3 opacity-50 text-xs text-center mt-12 pb-8">
                    <AlertTriangle className="w-3 h-3" />
                    <p>Don&apos;t refresh! Previous generations will be lost on page reload.</p>
                </motion.div>
            </motion.div>
          )}

        </div>
       </div>

       {/* YouTube Modal */}
       <AnimatePresence>
        {showYoutubeModal && (
          <motion.div 
            key="youtube-modal"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setShowYoutubeModal(false)}
          >
            <div className="w-full max-w-md bg-zinc-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col p-6 items-center text-center space-y-6" onClick={e => e.stopPropagation()}>
               
               <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                  <Play className="w-8 h-8 fill-current" />
               </div>

               <div className="space-y-2">
                 <h3 className="text-2xl font-bold text-white leading-tight">{youtubeQuery}</h3>
                 <p className="text-white/40 text-sm">Listen to the full song on YouTube</p>
               </div>
               
               <a 
                 href={activeYoutubeLink} 
                 target="_blank" 
                 rel="noreferrer"
                 className="w-full py-4 bg-[#FF0000] text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                 onClick={() => setShowYoutubeModal(false)}
               >
                 Search on YouTube <Play className="w-4 h-4 fill-current" />
               </a>

               <button 
                onClick={() => setShowYoutubeModal(false)} 
                className="text-white/40 text-sm hover:text-white transition"
               >
                Cancel
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
