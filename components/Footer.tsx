import React from "react";
import { Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="w-full bg-black border-t border-white/10 py-12 px-6 lg:px-12 text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold tracking-tighter text-white mb-2">
            jhakkas<span className="text-rose-500">.ai</span>
          </h3>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Jhakkas AI. All vibes reserved.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-8">
          <a 
            href="mailto:contact@jhakkas.ai" 
            className="flex items-center gap-2 text-white/60 hover:text-white transition group"
          >
            <Mail className="w-5 h-5 group-hover:text-blue-400 transition" />
            <span>Contact</span>
          </a>
          <a 
            href="https://github.com/rayat-7" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-white transition group"
          >
            <Github className="w-5 h-5 group-hover:text-white transition" />
            <span>GitHub</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
