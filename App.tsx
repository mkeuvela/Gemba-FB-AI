import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopicDetail } from './components/TopicDetail';
import { DashboardData, Topic, Update } from './types';
import { INITIAL_DATA } from './constants';
import { db } from './firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// Simple unique ID generator helper
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  // State
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [activeCategory, setActiveCategory] = useState<'rtb' | 'projects'>('rtb');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Firestore Connection & Real-time Sync
  useEffect(() => {
    // Reference to the database document "dashboard" in collection "content"
    const docRef = doc(db, "content", "dashboard");

    try {
      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        setIsConnected(true);
        if (docSnap.exists()) {
          // If data exists in DB, update our app state
          setData(docSnap.data() as DashboardData);
          setError(null);
        } else {
          // If no data exists (first time run), write the INITIAL_DATA to the DB
          console.log("No data found in DB, creating initial data...");
          setDoc(docRef, INITIAL_DATA);
        }
      }, (err) => {
        console.error("Firestore Error:", err);
        setError("Kan geen verbinding maken met database. Controleer firebaseConfig.ts");
        setIsConnected(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (err) {
      console.error("Connection Error", err);
      setError("Configuratie fout. Heb je de API keys ingevuld?");
    }
  }, []);

  // Helper to save data to Firestore
  // We sync the WHOLE state to keep consistency with the previous structure.
  const saveDataToFirebase = async (newData: DashboardData) => {
    try {
      // Optimistic update (show immediately on screen)
      setData(newData); 
      // Send to DB
      await setDoc(doc(db, "content", "dashboard"), newData);
    } catch (e) {
      console.error("Error saving document: ", e);
      alert("Fout bij opslaan: " + e);
    }
  };

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

    const newData = {
      ...data,
      [activeCategory]: {
        ...data[activeCategory],
        topics: [...data[activeCategory].topics, newTopic]
      }
    };
    saveDataToFirebase(newData);
  };

  const handleDeleteTopic = (id: string) => {
    const newData = {
      ...data,
      [activeCategory]: {
        ...data[activeCategory],
        topics: data[activeCategory].topics.filter(t => t.id !== id)
      }
    };
    saveDataToFirebase(newData);
    if (activeTopicId === id) setActiveTopicId(null);
  };

  const handleAddUpdate = (topicId: string, title: string, text: string) => {
    const newUpdate = {
      id: generateId(),
      title,
      text
    };

    const currentTopics = data[activeCategory].topics;
    const updatedTopics = currentTopics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          updates: [newUpdate, ...topic.updates]
        };
      }
      return topic;
    });

    const newData = {
      ...data,
      [activeCategory]: {
        ...data[activeCategory],
        topics: updatedTopics
      }
    };
    saveDataToFirebase(newData);
  };

  const handleEditUpdate = (topicId: string, updateId: string, title: string, text: string) => {
    const currentTopics = data[activeCategory].topics;
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

    const newData = {
      ...data,
      [activeCategory]: {
        ...data[activeCategory],
        topics: updatedTopics
      }
    };
    saveDataToFirebase(newData);
  };

  const handleReorderUpdates = (topicId: string, newUpdates: Update[]) => {
    const currentTopics = data[activeCategory].topics;
    const updatedTopics = currentTopics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          updates: newUpdates
        };
      }
      return topic;
    });

    const newData = {
      ...data,
      [activeCategory]: {
        ...data[activeCategory],
        topics: updatedTopics
      }
    };
    saveDataToFirebase(newData);
  };

  const handleDeleteUpdate = (topicId: string, updateId: string) => {
    const currentTopics = data[activeCategory].topics;
    const updatedTopics = currentTopics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          updates: topic.updates.filter(u => u.id !== updateId)
        };
      }
      return topic;
    });

    const newData = {
      ...data,
      [activeCategory]: {
        ...data[activeCategory],
        topics: updatedTopics
      }
    };
    saveDataToFirebase(newData);
  };

  const currentTopics = data[activeCategory].topics;
  const activeTopic = currentTopics.find(t => t.id === activeTopicId);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 flex-col p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border-l-4 border-red-500">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Configuratie Vereist</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="bg-gray-100 p-4 rounded text-xs font-mono text-gray-700 overflow-x-auto">
            1. Ga naar firebaseConfig.ts<br/>
            2. Vul de API Keys in van je Firebase Console<br/>
            3. Zorg dat je Firestore Database is aangemaakt (Test Mode)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        isConnected={isConnected}
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
            onReorderUpdates={handleReorderUpdates}
            onDeleteUpdate={handleDeleteUpdate}
          />
        </div>
      </main>
    </div>
  );
};

export default App;