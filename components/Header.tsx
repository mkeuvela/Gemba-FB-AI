import React from 'react';
import { Category } from '../types';

interface HeaderProps {
  activeCategory: 'rtb' | 'projects';
  onCategoryChange: (id: 'rtb' | 'projects') => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  isConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  isEditMode, 
  onToggleEditMode,
  isConnected = false
}) => {
  return (
    <header className="bg-avans-red text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-avans-red rounded-full flex items-center justify-center font-bold text-xl shadow-md border-2 border-avans-red">
              FB
            </div>
            <div className="flex flex-col">
              <h1 className="font-heading text-3xl font-bold tracking-wide uppercase leading-none">
                Gembawalk<span className="text-avans-purple"> FB AI</span>
              </h1>
              <span className="text-white/80 text-xs uppercase tracking-widest font-medium flex items-center gap-2">
                Dashboard
                {isConnected ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-100 border border-green-500/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                    LIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-100 border border-red-500/50">
                     OFFLINE
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-2 bg-black/10 p-1.5 rounded-lg backdrop-blur-sm">
            <button
              onClick={() => onCategoryChange('rtb')}
              className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === 'rtb'
                  ? 'bg-white text-avans-red shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Running the Business
            </button>
            <button
              onClick={() => onCategoryChange('projects')}
              className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === 'projects'
                  ? 'bg-white text-avans-red shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Projecten
            </button>
          </nav>

          {/* Controls */}
          <div className="flex items-center">
            <button
              onClick={onToggleEditMode}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-avans-red ${
                isEditMode ? 'bg-avans-orange' : 'bg-avans-darkBlue'
              }`}
            >
              <span className="sr-only">Toggle Edit Mode</span>
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isEditMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="ml-3 text-sm font-medium text-white/90">
              {isEditMode ? 'EDIT AAN' : 'EDIT UIT'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav (simplified) */}
      <div className="md:hidden flex border-t border-white/10">
        <button
          onClick={() => onCategoryChange('rtb')}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider ${
             activeCategory === 'rtb' ? 'bg-white text-avans-red' : 'bg-transparent text-white'
          }`}
        >
          RtB
        </button>
        <button
          onClick={() => onCategoryChange('projects')}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider ${
             activeCategory === 'projects' ? 'bg-white text-avans-red' : 'bg-transparent text-white'
          }`}
        >
          Projecten
        </button>
      </div>
    </header>
  );
};