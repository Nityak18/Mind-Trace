import React from "react";
import { SplineScene } from "./splite";
import { Card } from "./card";
import { Spotlight } from "./spotlight";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function BrainHero() {
  return (
    <div className="w-full min-h-[600px] bg-background/50 relative overflow-hidden">
      
      <div className="flex flex-col lg:flex-row h-full items-center relative z-10">
        {/* Left content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 p-8 md:p-12 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6 w-fit">
            <Sparkles className="w-3 h-3" /> Next-Gen Neural Analysis
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-text-primary to-text-secondary leading-tight">
            Decoding the <br />
            <span className="text-primary italic">Human Mind</span>
          </h1>
          <p className="mt-6 text-text-secondary text-lg max-w-lg leading-relaxed">
            Experience the future of mental health monitoring. Our interactive neural mapping 
            uncovers patterns in your emotional data with clinical precision and empathetic AI.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-10">
            <Link to="/analyzer" className="btn-gradient px-8 py-4 flex items-center gap-2 group">
              Start Neural Scan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/about" className="btn-ghost px-8 py-4">
              How it works
            </Link>
          </div>
        </motion.div>

        {/* Right content - 2D Animated Brain (Safe Version) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex-1 relative w-full h-[400px] lg:h-[600px] flex items-center justify-center"
        >
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
             <Brain className="w-48 h-48 md:w-64 md:h-64 text-primary relative z-10 drop-shadow-[0_0_30px_rgba(124,106,247,0.5)]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
