import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Menu, X } from 'lucide-react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden flex flex-col">
        {/* Abstract Background Elements - WOW Factor */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[130px] animate-blob mix-blend-screen" />
          <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/15 blur-[130px] animate-blob mix-blend-screen" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[-10%] left-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[130px] animate-blob mix-blend-screen" style={{ animationDelay: '4s' }} />
        </div>

        <Navbar />
        
        <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-24 z-10">
          <AnimatePresence mode="wait">
            <RoutesWithAnimation />
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

function RoutesWithAnimation() {
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
      <Route path="/analyzer" element={<PageWrapper><Analyzer /></PageWrapper>} />
      <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
      <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
    </Routes>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export default App;
