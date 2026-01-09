"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageSquare, ExternalLink } from "lucide-react";

export default function JhakkasNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "top" },
    { name: "Create Vibe", href: "vibe-studio" },
    { name: "Showcase", href: "showcase" },
    { name: "About", href: "footer" },
  ];

  const handleScroll = (id: string) => {
    setIsOpen(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full px-6 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          
          {/* LEFT: HAMBURGER & BRAND */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition active:scale-95 shadow-lg group"
            >
              <Menu className="w-6 h-6 group-hover:rotate-180 transition duration-500" />
            </button>
            <div className="text-2xl font-bold tracking-tighter text-white hidden md:block backdrop-blur-sm px-4 py-2 rounded-full">
              Jhakkas<span className="text-rose-500">.ai</span>
            </div>
          </div>

          {/* RIGHT: CTA */}
          {/* <a
            href="https://github.com/rayat-7/jhakkas_ai/feedback"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm font-medium hover:bg-white/20 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Feedback</span>
          </a> */}

        </div>
      </nav>

      {/* DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 z-[70] h-full w-[300px] bg-black border-r border-white/10 p-8 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                 <div className="text-2xl font-bold tracking-tighter text-white">
                  jhakkas<span className="text-blue-500">.ai</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleScroll(link.href)}
                    className="text-left text-2xl font-medium text-white/60 hover:text-white hover:pl-4 transition-all duration-300 py-2"
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-white/10">
                 <a 
                   href="#" 
                   className="flex items-center gap-3 text-white/40 hover:text-blue-400 transition text-sm"
                 >
                   Join the community <ExternalLink className="w-3 h-3" />
                 </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}