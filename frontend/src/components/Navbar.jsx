import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Analyzer', path: '/analyzer' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[rgba(13,17,23,0.8)] backdrop-blur-[20px] border-b border-white/5 transition-all duration-300">
      <div className="max-w-[1100px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary overflow-hidden shadow-[0_0_15px_rgba(124,106,247,0.2)]">
            <Brain className="w-6 h-6 absolute animate-pulse" />
            <Activity className="w-8 h-8 absolute opacity-0 group-hover:opacity-100 group-hover:animate-ping text-secondary transition-opacity" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-text-primary group-hover:text-primary transition-colors">MindSense</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[15px] font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link to="/analyzer" className="btn-primary py-2.5 text-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { height: 'auto', opacity: 1, display: 'block' },
          closed: { height: 0, opacity: 0, transitionEnd: { display: 'none' } }
        }}
        className="md:hidden overflow-hidden bg-surface-elevated border-b border-white/5"
      >
        <div className="flex flex-col px-6 py-4 gap-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-[15px] font-medium py-2 ${
                location.pathname === link.path
                  ? 'text-primary'
                  : 'text-text-secondary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/analyzer" onClick={() => setIsOpen(false)} className="btn-primary text-center mt-2">
            Get Started
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
