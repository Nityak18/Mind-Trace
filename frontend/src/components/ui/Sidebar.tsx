import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Brain,
  LayoutDashboard,
  Info,
  ChevronDown,
  ChevronsRight,
  Moon,
  Sun,
  Settings,
  HelpCircle,
  Activity
} from "lucide-react";

interface SidebarProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isDark, setIsDark }) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r border-white/5 transition-all duration-300 ease-in-out ${
        open ? "w-64" : "w-20"
      } bg-surface-elevated flex flex-col shadow-xl z-[60] print:hidden`}
    >
      <TitleSection open={open} />

      <div className="flex-1 px-3 space-y-2 mt-4">
        <SidebarOption
          Icon={Home}
          title="Home"
          path="/"
          selected={location.pathname === "/"}
          open={open}
        />
        <SidebarOption
          Icon={Brain}
          title="Analyzer"
          path="/analyzer"
          selected={location.pathname === "/analyzer"}
          open={open}
        />
        <SidebarOption
          Icon={LayoutDashboard}
          title="Dashboard"
          path="/dashboard"
          selected={location.pathname === "/dashboard"}
          open={open}
        />
        <SidebarOption
          Icon={Info}
          title="About"
          path="/about"
          selected={location.pathname === "/about"}
          open={open}
        />
      </div>

      <div className="px-3 border-t border-white/5 py-4 space-y-2">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`flex h-12 w-full items-center rounded-xl transition-all duration-200 text-text-secondary hover:bg-white/5 hover:text-text-primary`}
        >
          <div className="grid h-full w-12 place-content-center shrink-0">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </div>
          {open && <span className="text-sm font-medium">Theme</span>}
        </button>
        
        <SidebarOption
          Icon={Settings}
          title="Settings"
          path="/settings"
          selected={location.pathname === "/settings"}
          open={open}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

interface SidebarOptionProps {
  Icon: React.ElementType;
  title: string;
  path: string;
  selected: boolean;
  open: boolean;
}

const SidebarOption: React.FC<SidebarOptionProps> = ({ Icon, title, path, selected, open }) => {
  return (
    <Link
      to={path}
      className={`relative flex h-12 w-full items-center rounded-xl transition-all duration-200 group ${
        selected
          ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(124,106,247,0.2)]"
          : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
      }`}
    >
      <div className="grid h-full w-14 place-content-center shrink-0">
        <Icon className={`h-5 w-5 ${selected ? "animate-pulse" : ""}`} />
      </div>

      {open && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
          {title}
        </span>
      )}

      {selected && (
        <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
      )}
    </Link>
  );
};

interface TitleSectionProps {
  open: boolean;
}

const TitleSection: React.FC<TitleSectionProps> = ({ open }) => {
  return (
    <div className="p-4 border-b border-white/5 h-24 flex items-center">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="grid size-12 shrink-0 place-content-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
           <Brain className="w-7 h-7 text-white" />
        </div>
        {open && (
          <div className="transition-all duration-300">
            <span className="block text-lg font-bold text-text-primary leading-tight">
              MindSense
            </span>
            <span className="block text-[10px] text-primary font-bold uppercase tracking-widest">
              AI Powered
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface ToggleCloseProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const ToggleClose: React.FC<ToggleCloseProps> = ({ open, setOpen }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="border-t border-white/5 hover:bg-white/5 transition-colors p-4"
    >
      <div className="flex items-center justify-center gap-3">
        <ChevronsRight
          className={`h-5 w-5 transition-transform duration-500 text-text-secondary ${
            open ? "rotate-180" : ""
          }`}
        />
        {open && (
          <span className="text-sm font-medium text-text-secondary">Collapse</span>
        )}
      </div>
    </button>
  );
};
