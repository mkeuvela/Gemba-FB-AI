import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopicDetail } from './components/TopicDetail';
import { DashboardData, Topic } from './types';
import { INITIAL_DATA, STORAGE_KEY } from './constants';

// Simple unique ID generator helper to avoid external deps for this demo
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  // State
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [activeCategory, setActiveCategory] = useState<'rtb' | 'projects'>('rtb');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse local storage data", e);
        // Fallback to initial data if parse fails
      }
    }
  }, []);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // When category changes, reset active topic
  const handleCategoryChange = (cat: 'rtb' | 'projects') => {
    setActiveCategory(cat);
    setActiveTopicId(null);
  };

  // Actions
  const handleAddTopic = (title: string) => {
    const newTopic: Topic = {
      id: generateId(),
      title,
      updates: []
    };

    setData(prev => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        topics: [...prev[activeCategory].topics, newTopic]
      }
    }));
  };

  const handleDeleteTopic = (id: string) => {
    setData(prev => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        topics: prev[activeCategory].topics.filter(t => t.id !== id)
      }
    }));
    if (activeTopicId === id) setActiveTopicId(null);
  };

  const handleAddUpdate = (topicId: string, title: string, text: string) => {
    const newUpdate = {
      id: generateId(),
      title,
      text
    };

    setData(prev => {
      const currentTopics = prev[activeCategory].topics;
      const updatedTopics = currentTopics.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            // Prepend new update to show it at the top
            updates: [newUpdate, ...topic.updates]
          };
        }
        return topic;
      });

      return {
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          topics: updatedTopics
        }
      };
    });
  };

  const handleEditUpdate = (topicId: string, updateId: string, title: string, text: string) => {
    setData(prev => {
      const currentTopics = prev[activeCategory].topics;
      const updatedTopics = currentTopics.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            updates: topic.updates.map(u => 
              u.id === updateId ? { ...u, title, text } : u
            )
          };
        }
        return topic;
      });

      return {
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          topics: updatedTopics
        }
      };
    });
  };

  const handleDeleteUpdate = (topicId: string, updateId: string) => {
    setData(prev => {
      const currentTopics = prev[activeCategory].topics;
      const updatedTopics = currentTopics.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            updates: topic.updates.filter(u => u.id !== updateId)
          };
        }
        return topic;
      });

      return {
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          topics: updatedTopics
        }
      };
    });
  };

  const currentTopics = data[activeCategory].topics;
  const activeTopic = currentTopics.find(t => t.id === activeTopicId);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
      />
      
      <main className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <div className="flex w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <Sidebar 
            topics={currentTopics}
            activeTopicId={activeTopicId}
            onTopicSelect={setActiveTopicId}
            isEditMode={isEditMode}
            onAddTopic={handleAddTopic}
            onDeleteTopic={handleDeleteTopic}
          />
          
          <TopicDetail 
            topic={activeTopic}
            isEditMode={isEditMode}
            onAddUpdate={handleAddUpdate}
            onEditUpdate={handleEditUpdate}
            onDeleteUpdate={handleDeleteUpdate}
          />
        </div>
      </main>
    </div>
  );
};

export default App;