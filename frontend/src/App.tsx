import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Menu, X } from 'lucide-react';

import Navbar from './components/Navbar';
import { Sidebar } from './components/ui/Sidebar';
import AetherBackground from './components/ui/AetherBackground';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <Router>
      <div className={`min-h-screen flex ${isDark ? 'dark' : ''} bg-background text-text-primary`}>
        <Sidebar isDark={isDark} setIsDark={setIsDark} />
        
        <main className="flex-1 h-screen overflow-y-auto px-8 py-10 z-10 custom-scrollbar">
          <div className="max-w-[1200px] mx-auto">
             <RoutesWithAnimation />
          </div>
        </main>
      </div>
    </Router>
  );
}

function RoutesWithAnimation() {
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/analyzer" element={<Analyzer />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

interface PageWrapperProps {
  children: React.ReactNode;
}

function PageWrapper({ children }: PageWrapperProps) {
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
