
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRandomRecipes } from '../services/spoonacularService';
import RecipeCard from '../components/RecipeCard';
import { RecipeCardInfo } from '../types';
import { BookOpenIcon, Bars4Icon, ShoppingBagIcon, CalendarDaysIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeCardInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State and ref for language dropdown
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        setLoading(true);
        const data = await getRandomRecipes(4);
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch random recipes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRandomRecipes();
  }, []);

  // Effect to close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hello, Foodie!</h1>
          <p className="text-gray-600">What would you like to cook today?</p>
        </div>
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
            aria-label="Change language"
          >
            <GlobeAltIcon className="h-7 w-7" />
          </button>
          {isLangMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20 border border-gray-200">
              <ul className="py-1">
                <li><button onClick={() => setIsLangMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">العربية</button></li>
                <li><button onClick={() => setIsLangMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English</button></li>
                <li><button onClick={() => setIsLangMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Français</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => navigate('/recipes')} className="flex flex-col items-center justify-center text-center p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors">
          <BookOpenIcon className="h-8 w-8 mb-1" />
          <span className="font-semibold text-sm">Recipes</span>
        </button>
        <button onClick={() => navigate('/ingredients')} className="flex flex-col items-center justify-center text-center p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
          <Bars4Icon className="h-8 w-8 mb-1" />
          <span className="font-semibold text-sm">Ingredients</span>
        </button>
        <button onClick={() => navigate('/products')} className="flex flex-col items-center justify-center text-center p-4 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-colors">
          <ShoppingBagIcon className="h-8 w-8 mb-1" />
          <span className="font-semibold text-sm">Products</span>
        </button>
        <button onClick={() => navigate('/planner')} className="flex flex-col items-center justify-center text-center p-4 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-colors">
          <CalendarDaysIcon className="h-8 w-8 mb-1" />
          <span className="font-semibold text-sm">Meal Planning</span>
        </button>
      </div>

      {/* Recent Recipes */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">Recent Recipes</h2>
          <Link to="/recipes" className="text-sm font-semibold text-orange-500 hover:text-orange-600">
            View All &gt;
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
