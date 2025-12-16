import React, { useState } from 'react';
import { Topic } from '../types';

interface SidebarProps {
  topics: Topic[];
  activeTopicId: string | null;
  onTopicSelect: (id: string) => void;
  isEditMode: boolean;
  onAddTopic: (title: string) => void;
  onDeleteTopic: (id: string) => void;
}

// Helper to determine icon based on title keywords
const getIconForTopic = (title: string) => {
  const t = title.toLowerCase();
  
  if (t.includes('osiris') || t.includes('data') || t.includes('database')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
    );
  }
  if (t.includes('studielink') || t.includes('inschrijf') || t.includes('link')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    );
  }
  if (t.includes('international') || t.includes('erasmus') || t.includes('global')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    );
  }
  if (t.includes('beheer') || t.includes('gilde') || t.includes('support')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
    );
  }
  if (t.includes('management') || t.includes('info') || t.includes('rapport')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    );
  }
  if (t.includes('project') || t.includes('toekomst') || t.includes('cloud')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c0-1.7-1.3-3-3-3h-11"/><path d="M6 16v6"/><path d="M10 22h-4"/><path d="M17.5 12a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"/><path d="m15.5 15.5 4 4"/></svg>
    );
  }

  // Default icon
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  topics,
  activeTopicId,
  onTopicSelect,
  isEditMode,
  onAddTopic,
  onDeleteTopic,
}) => {
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopicTitle.trim()) {
      onAddTopic(newTopicTitle.trim());
      setNewTopicTitle('');
    }
  };

  return (
    <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="p-6 bg-gray-50 border-b border-gray-100">
        <h2 className="font-heading text-2xl font-bold text-avans-darkBlue uppercase tracking-wide">
          Onderwerpen
        </h2>
        <p className="text-gray-500 text-sm mt-1">Selecteer een item uit de lijst</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`group relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
              activeTopicId === topic.id
                ? 'bg-avans-red/5 border-avans-red shadow-sm'
                : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => onTopicSelect(topic.id)}
          >
            {/* Active Indicator Strip */}
            <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-colors ${
               activeTopicId === topic.id ? 'bg-avans-red' : 'bg-transparent'
            }`}></div>
            
            <div className={`mr-4 transition-colors ${activeTopicId === topic.id ? 'text-avans-red' : 'text-gray-400 group-hover:text-avans-darkBlue'}`}>
               {getIconForTopic(topic.title)}
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold ${activeTopicId === topic.id ? 'text-avans-red' : 'text-gray-700'}`}>
                {topic.title}
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {topic.updates.length} updates
              </span>
            </div>

            {isEditMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if(confirm(`Weet je zeker dat je "${topic.title}" wilt verwijderen?`)) {
                    onDeleteTopic(topic.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-avans-brightRed transition-opacity"
                title="Verwijder onderwerp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            )}
          </div>
        ))}
        
        {topics.length === 0 && (
          <div className="text-center py-8 text-gray-400 italic text-sm">
            Geen onderwerpen gevonden.
          </div>
        )}
      </div>

      {isEditMode && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleAddSubmit} className="flex gap-2">
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="Nieuw onderwerp..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-avans-orange bg-white text-gray-900"
            />
            <button
              type="submit"
              disabled={!newTopicTitle.trim()}
              className="bg-avans-orange text-white p-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};