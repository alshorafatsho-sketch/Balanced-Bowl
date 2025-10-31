import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Planner from './pages/Planner';
import GroceryList from './pages/GroceryList';
import CookMode from './pages/CookMode';
import BottomNav from './components/BottomNav';
import { AppContextProvider } from './context/AppContext';
import AIChat from './components/AIChat';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import TopHeader from './components/TopHeader';
import Ingredients from './pages/Ingredients';
import Products from './pages/Products';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const PageRoutes = () => {
    const location = useLocation();
    const isCookMode = location.pathname.startsWith('/cook/');

    return (
      <div className="md:pl-20">
        {!isCookMode && <TopHeader />}
        <main className="pb-24 md:pb-4 pt-32 md:pt-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/products" element={<Products />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/cook/:id" element={<CookMode />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/groceries" element={<GroceryList />} />
          </Routes>
        </main>
        {!isCookMode && <BottomNav />}
        {!isCookMode && (
          <>
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 z-40"
              aria-label="Open AI Cooking Assistant"
            >
              <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />
            </button>
            <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </>
        )}
      </div>
    );
  };
  
  return (
    <AppContextProvider>
      <HashRouter>
        <PageRoutes />
      </HashRouter>
    </AppContextProvider>
  );
};

export default App;