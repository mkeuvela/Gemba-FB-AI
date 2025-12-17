import React, { useState, useEffect, useRef } from 'react';
import { Topic, Update } from '../types';

interface TopicDetailProps {
  topic: Topic | undefined;
  isEditMode: boolean;
  onAddUpdate: (topicId: string, title: string, text: string) => void;
  onEditUpdate: (topicId: string, updateId: string, title: string, text: string) => void;
  onReorderUpdates: (topicId: string, updates: Update[]) => void;
  onDeleteUpdate: (topicId: string, updateId: string) => void;
}

// 1. Define a reliable Fallback image (Modern Office)
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';

// 2. Smart image selector with verified IDs
const getTopicImage = (title: string) => {
  const t = title.toLowerCase();

  // International / Global / Erasmus -> Globe/Travel/Map theme
  if (t.includes('international') || t.includes('erasmus') || t.includes('global') || t.includes('buitenland')) {
    return 'https://images.unsplash.com/photo-1529101091760-6149d4c46b29?auto=format&fit=crop&w=800&q=80'; 
  }

  // Studielink / Inschrijvingen / Education -> Student/University/Library
  if (t.includes('studielink') || t.includes('student') || t.includes('inschrijf') || t.includes('onderwijs')) {
    return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'; 
  }

  // Tech / Database / Osiris / Cloud / Server -> Data Center/Abstract Tech
  if (t.includes('osiris') || t.includes('data') || t.includes('server') || t.includes('techniek') || t.includes('cloud') || t.includes('migratie')) {
    return 'https://images.unsplash.com/photo-1558494949-ef526b01201b?auto=format&fit=crop&w=800&q=80'; 
  }

  // Functioneel Beheer / Support / Gilde -> Team/Collaboration/Hands
  if (t.includes('beheer') || t.includes('support') || t.includes('gilde') || t.includes('service') || t.includes('nazorg')) {
    return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'; 
  }

  // Management / Finance / Reporting -> Analytics/Charts/Meeting
  if (t.includes('management') || t.includes('info') || t.includes('financ') || t.includes('rapport')) {
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'; 
  }

  // Projects / Planning / Future -> Blueprints/Whiteboard/Strategy
  if (t.includes('project') || t.includes('toekomst') || t.includes('planning') || t.includes('roadmap')) {
    return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80';
  }

  // Fallback Pool for generic titles - Verified IDs
  const genericImages = [
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', // Office Work
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', // Corporate Building
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80', // Coworking
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', // Meeting Room
    'https://images.unsplash.com/photo-1507537297725-24a1c434c67b?auto=format&fit=crop&w=800&q=80', // Lightbulb/Idea
  ];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % genericImages.length;
  return genericImages[index];
};

export const TopicDetail: React.FC<TopicDetailProps> = ({
  topic,
  isEditMode,
  onAddUpdate,
  onEditUpdate,
  onReorderUpdates,
  onDeleteUpdate,
}) => {
  // State for adding new item
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateText, setNewUpdateText] = useState('');

  // State for editing existing item
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  
  // State for image handling to force re-render on error
  const [imgSrc, setImgSrc] = useState<string>(FALLBACK_IMAGE);

  // Drag and drop refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Update image source when topic changes
  useEffect(() => {
    if (topic) {
      setImgSrc(getTopicImage(topic.title));
    }
  }, [topic]);

  if (!topic) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full p-8 bg-gray-50/50">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
        </div>
        <p className="font-heading text-xl uppercase tracking-wide text-gray-500">Selecteer een onderwerp</p>
      </div>
    );
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUpdateTitle.trim() || newUpdateText.trim()) {
      onAddUpdate(topic.id, newUpdateTitle.trim(), newUpdateText.trim());
      setNewUpdateTitle('');
      setNewUpdateText('');
    }
  };

  const startEditing = (update: Update) => {
    setEditingId(update.id);
    setEditTitle(update.title);
    setEditText(update.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditText('');
  };

  const saveEditing = (updateId: string) => {
    if (editTitle.trim() || editText.trim()) {
      onEditUpdate(topic.id, updateId, editTitle.trim(), editText.trim());
      cancelEditing();
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    // Transparent ghost image effect
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
    e.preventDefault();
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('opacity-50');

    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      return;
    }

    const copyListItems = [...topic.updates];
    const dragItemContent = copyListItems[dragItem.current];
    
    // Remove item from old position
    copyListItems.splice(dragItem.current, 1);
    // Insert item at new position
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    
    // Update parent
    onReorderUpdates(topic.id, copyListItems);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white">
      {/* Side Image Column (Left) */}
      <div className="hidden lg:block w-72 h-full bg-avans-darkBlue border-r border-gray-200 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 z-0 bg-avans-darkBlue">
          <img 
            src={imgSrc} 
            alt="Topic visual" 
            className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
            onError={(e) => {
              // If image fails, replace with fallback
              e.currentTarget.src = FALLBACK_IMAGE;
              e.currentTarget.onerror = null; // Prevent infinite loop
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-avans-darkBlue/90 via-avans-darkBlue/20 to-transparent mix-blend-multiply"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
           <span className="block w-8 h-1 bg-avans-orange mb-2"></span>
           <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Onderwerp</p>
           <p className="font-heading text-2xl font-bold leading-none break-words">{topic.title}</p>
        </div>
      </div>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-avans-red"></span>
              <span className="text-xs font-bold text-avans-red uppercase tracking-widest">Detail Weergave</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-avans-darkBlue uppercase tracking-tight leading-none break-words">
            {topic.title}
          </h2>
        </div>

        {/* Content Updates */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
          {isEditMode && (
            <div className="mb-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6">
              <h4 className="font-bold text-avans-darkBlue mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-avans-orange"><path d="M12 5v14M5 12h14"/></svg>
                  Nieuwe Update Toevoegen
              </h4>
              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Titel / Onderwerp</label>
                    <input
                      type="text"
                      value={newUpdateTitle}
                      onChange={(e) => setNewUpdateTitle(e.target.value)}
                      placeholder="Bijv. Migratie Cloud"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-avans-orange text-sm bg-white text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Beschrijving</label>
                    <textarea
                      value={newUpdateText}
                      onChange={(e) => setNewUpdateText(e.target.value)}
                      placeholder="Wat is de status?"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-avans-orange text-sm resize-none bg-white text-gray-900"
                    />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newUpdateTitle.trim() && !newUpdateText.trim()}
                    className="px-4 py-2 bg-avans-darkBlue text-white text-sm font-bold rounded-md hover:bg-blue-900 transition-colors disabled:opacity-50"
                  >
                    Toevoegen
                  </button>
                </div>
              </form>
            </div>
          )}

          {topic.updates.length > 0 ? (
            <div className="space-y-8">
              {topic.updates.map((update, index) => (
                <div 
                  key={update.id} 
                  className={`relative group ${isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  draggable={isEditMode}
                  onDragStart={(e) => isEditMode && handleDragStart(e, index)}
                  onDragEnter={(e) => isEditMode && handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()} // Necessary for drop to work
                >
                   {editingId === update.id ? (
                    <div className="bg-white p-5 rounded-xl border border-avans-orange shadow-md relative z-20">
                       <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Titel</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-avans-orange text-sm bg-white text-gray-900"
                          />
                       </div>
                       <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Beschrijving</label>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-avans-orange text-sm resize-none bg-white text-gray-900"
                          />
                       </div>
                       <div className="flex justify-end gap-2">
                         <button onClick={cancelEditing} className="px-3 py-1 text-gray-600 text-xs font-medium hover:bg-gray-100 rounded">
                           Annuleren
                         </button>
                         <button onClick={() => saveEditing(update.id)} className="px-3 py-1 bg-avans-orange text-white text-xs font-bold rounded hover:bg-orange-600">
                           Opslaan
                         </button>
                       </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl transition-all duration-200">
                      
                      {/* Drag Handle Overlay */}
                      {isEditMode && (
                        <div className="absolute -left-8 top-1 h-full flex items-start pt-1 text-gray-300 group-hover:text-avans-orange transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-avans-blue leading-tight select-none">
                          {update.title}
                        </h3>
                        
                        {isEditMode && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEditing(update)}
                              className="text-gray-300 hover:text-avans-blue p-1 transition-colors"
                              title="Bewerk update"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button
                              onClick={() => {
                                if(confirm('Weet je zeker dat je deze update wilt verwijderen?')) {
                                  onDeleteUpdate(topic.id, update.id)
                                }
                              }}
                              className="text-gray-300 hover:text-avans-brightRed p-1 transition-colors"
                              title="Verwijder update"
                            >
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        )}
                      </div>
                      {update.text && (
                        <p className="text-gray-700 leading-relaxed text-base font-normal border-l-4 border-gray-100 pl-4 select-none">
                          {update.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Nog geen updates voor dit onderwerp.</p>
              {isEditMode && <p className="text-avans-orange text-xs mt-2 font-medium">Gebruik het formulier hierboven om er een toe te voegen.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};