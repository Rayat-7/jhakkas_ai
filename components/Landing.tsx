"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JhakkasNav from "./Navbar";
import VibeStudio from "./VibeStudio";
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1920",
  "https://images.unsplash.com/photo-1587984584042-dcc9ba27e054?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

import Footer from "./Footer";
import TestimonialSection from "./TestimonialSection";
import ShinyText from "./ShinyText";

export default function JhakkasHero() {
  const [currentImg, setCurrentImg] = useState(0);
  const [showPromptGuide, setShowPromptGuide] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const scrollToVibeStudio = () => {
    const element = document.getElementById("vibe-studio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-black selection:bg-blue-500/30">
      
      <div className="relative min-h-screen flex flex-col">
        {/* 1. ANIMATED DYNAMIC BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="relative h-full w-full"
            >
              <img
                src={BACKGROUND_IMAGES[currentImg]}
                className="h-full w-full object-cover brightness-[0.55] saturate-[0.8]"
                alt="Background vibe"
              />
              {/* Subtle Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2. NAVIGATION BAR */}
        <JhakkasNav/>

        {/* 3. HERO CONTENT */}
        <main className="relative z-20 flex-grow flex flex-col justify-center px-6 lg:px-12 py-20">
          <div className="w-full flex justify-between items-end min-h-[60vh]">
            
            {/* TEXT CONTENT (Left Aligned) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-4xl flex flex-col justify-end"
            >
              <h1 className="text-5xl md:text-5xl lg:text-[9rem] flex gap-3 font-bold tracking-tight text-white leading-[0.9]">
                <ShinyText text="Jhakkas" disabled={false} speed={3} className="custom-class" color="#ffffff" shineColor="#f78936ff" /> 
                <div className="flex items-end" >
                    <p className="text-4xl italic font-bold tracking-tight leading-[0.9] pl-0.5  p-1 mr-2 bg-gradient-to-br from-orange-400 via-yellow-400 to-red-600 bg-clip-text text-transparent ">AI</p>
                    <p className="text-4xl italic font-bold tracking-tight leading-[0.9] pl-0.5 p-1 bg-gradient-to-tl from-orange-500 via-rose-600 to-red-400 bg-clip-text text-transparent">Caption</p> 
                </div> 
              </h1>
             
              <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
                The next-generation multimodal AI that turns your photos into viral stories. 
              Analyze vibes, find <span className="font-bold bg-white/10 text-white px-3 py-2 rounded-full">perfect lyrics</span>, and stop the <span className="font-bold bg-white/10 text-white px-3 py-2 rounded-full">"caption struggle"</span> forever.
              </p>
            </motion.div>
    
            {/* BUTTON GROUP (Distributed to Bottom Right) */}
            <div className="hidden md:flex flex-col items-end gap-3 lg:gap-4 mb-2">
              <button 
                onClick={scrollToVibeStudio}
                className="px-10 py-3 rounded-full font-bold bg-gradient-to-l from-[#f97316] via-[#e11d48] to-[#ef4444] text-white hover:scale-105 active:scale-95 transition shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)]"
              >
                  Try Now
              </button>
              <button 
                onClick={() => setShowPromptGuide(true)}
                className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition flex items-center gap-2"
              >
                 Prompt Guide
              </button>
            </div>
          </div>
          
          {/* Mobile Buttons (Visible only on small screens) */}
          <div className="md:hidden mt-8 grid grid-cols-2 gap-3">
             <button 
                onClick={scrollToVibeStudio}
                className="col-span-2 px-8 py-3 rounded-full font-bold bg-white text-black/90 hover:scale-105 active:scale-95 transition shadow-[0_0_20px_rgba(225,29,72,0.4)]"
              >
                Try Now
              </button>
              <button 
                onClick={() => setShowPromptGuide(true)}
                className="col-span-2 px-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm"
              >
                Prompt Guide
              </button>
          </div>

        </main>
      </div>

       {/* PROMPT GUIDE MODAL */}
       <AnimatePresence>
        {showPromptGuide && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
            onClick={() => setShowPromptGuide(false)}
          >
            <div 
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl" 
              onClick={e => e.stopPropagation()}
            >
               {/* Close Button */}
               <button 
                  onClick={() => setShowPromptGuide(false)} 
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
               >
                  <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>

               <div className="mb-8">
                  <h3 className="text-3xl font-bold text-white mb-2">How to get <span className="text-blue-500">Jhakkas</span> Results ✨</h3>
                  <p className="text-white/60">Follow these tips to make the AI understand your vibe perfectly.</p>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-4 font-bold text-xl">✓</div>
                      <h4 className="text-white font-bold mb-2">Do This</h4>
                      <ul className="text-sm text-white/70 space-y-2">
                        <li>• "My black leather jacket at a rooftop party"</li>
                        <li>• "The sunset reflection in my sunglasses"</li>
                        <li>• "Drinking chai on a rainy balcony"</li>
                      </ul>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-4 font-bold text-xl">✗</div>
                      <h4 className="text-white font-bold mb-2">Avoid This</h4>
                      <ul className="text-sm text-white/70 space-y-2">
                        <li>• "Me" (Too vague)</li>
                        <li>• "Cool photo" (Doesn't describe content)</li>
                        <li>• "Upload 1.jpg" (AI can't read filenames)</li>
                      </ul>
                  </div>
               </div>

               <button 
                 onClick={() => { setShowPromptGuide(false); scrollToVibeStudio(); }}
                 className="w-full mt-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] transition"
               >
                 Got it, let's create! 🚀
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

       {/* 3.5 SHOWCASE / TESTIMONIALS */}
       <div id="showcase">
        <TestimonialSection />
       </div>

      {/* 4. VIBE STUDIO SECTION (Static) */}
      <VibeStudio />
      
      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}










// "use client";
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button"; // shadcn component
// import { Input } from "@/components/ui/input";   // shadcn component

// const BACKGROUND_IMAGES = [
//   "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Concert Vibe
//   "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=1920&q=80", // Urban Style
//   "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1920&q=80", // Cinematic Portrait
// ];

// export default function JhakkasLanding() {
//   const [currentImg, setCurrentImg] = useState(0);

//   // Auto-slide background every 5 seconds
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentImg((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
//     }, 4000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans">
      
//       {/* 1. THE MOVING BACKGROUND CAROUSEL */}
//       <div className="absolute inset-0 z-0">
//         <AnimatePresence mode="wait">
//           <motion.img
//             key={currentImg}
//             src={BACKGROUND_IMAGES[currentImg]}
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 1.5, ease: "easeInOut" }}
//             className="h-full w-full object-cover brightness-[0.6]"
//           />
//         </AnimatePresence>
//       </div>

//       {/* 2. FIXED TOP NAVIGATION */}
//       <nav className="relative z-20 flex items-center justify-between p-6 backdrop-blur-sm bg-black/10">
//         <div className="text-2xl font-black tracking-tighter text-white">
//           jhakkas<span className="text-blue-500">.ai</span>
//         </div>
//         <div className="hidden space-x-8 text-sm font-medium text-white/80 md:flex">
//           <a href="#" className="hover:text-white transition">Home</a>
//           <a href="#" className="hover:text-white transition">Features</a>
//           <a href="#" className="hover:text-white transition">About</a>
//         </div>
//         <Button variant="outline" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">
//           Sign In
//         </Button>
//       </nav>

//       {/* 3. STATIC HERO CONTENT (Does not move) */}
//       <main className="relative z-20 flex h-[80vh] flex-col justify-end px-10 pb-20 md:px-20">
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5, duration: 0.8 }}
//           className="max-w-3xl"
//         >
//           <h1 className="text-7xl font-extrabold tracking-tight text-white md:text-9xl">
//             Jhakkas <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">4.0</span>
//           </h1>
          
//           <p className="mt-6 max-w-xl text-lg text-white/70 leading-relaxed md:text-xl">
//             The next-generation multimodal AI that turns your photos into viral stories. 
//             Analyze vibes, find perfect lyrics, and stop the "caption struggle" forever.
//           </p>

//           <div className="mt-10 flex flex-wrap gap-4">
//             <Button size="lg" className="h-14 rounded-full bg-white px-8 text-black hover:bg-white/90">
//               Get Started Free
//             </Button>
//             <Button size="lg" variant="outline" className="h-14 rounded-full border-white/20 bg-white/5 px-8 text-white backdrop-blur-md hover:bg-white/10">
//               Watch Demo
//             </Button>
//           </div>
//         </motion.div>
//       </main>

//       {/* 4. BOTTOM BLUR OVERLAY (Optional for depth) */}
//       <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black to-transparent z-10" />
//     </div>
//   );
// }