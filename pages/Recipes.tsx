import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchRecipes, getRandomRecipes } from '../services/spoonacularService';
import RecipeCard from '../components/RecipeCard';
import { RecipeCardInfo } from '../types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const dietaryFilters = ["Vegetarian", "Vegan", "Gluten Free", "Ketogenic", "Pescetarian"];

const Recipes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [recipes, setRecipes] = useState<RecipeCardInfo[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<RecipeCardInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDiet, setActiveDiet] = useState<string | null>(null);
  
  const performSearch = useCallback(async (searchQuery: string, diet?: string) => {
    if (!searchQuery && !diet) {
      setRecipes([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchRecipes(searchQuery, diet);
      setRecipes(data.results);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getRandomRecipes(4).then(setRandomRecipes);
  }, []);
  
  useEffect(() => {
    if (initialQuery) {
        performSearch(initialQuery, activeDiet);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, activeDiet]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    performSearch(query, activeDiet);
  };
  
  const handleDietClick = (diet: string) => {
      const newDiet = activeDiet === diet ? null : diet;
      setActiveDiet(newDiet);
      if(query || newDiet) {
        performSearch(query, newDiet);
      }
  }

  const showRandom = !recipes.length && !loading && !error && !initialQuery && !activeDiet;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Recipe</h1>
      
      <form onSubmit={handleSearch} className="hidden md:flex items-center mb-4 bg-white rounded-full shadow-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword or ingredient..."
          className="w-full bg-transparent px-6 py-3 text-gray-700 focus:outline-none"
        />
        <button type="submit" className="p-3 bg-orange-500 text-white rounded-full m-1 hover:bg-orange-600">
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-8">
        {dietaryFilters.map(diet => (
            <button key={diet} onClick={() => handleDietClick(diet)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeDiet === diet ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {diet}
            </button>
        ))}
      </div>

      {loading && <div className="text-center p-8">Loading...</div>}
      {error && <div className="text-center p-8 text-red-500">{error}</div>}
      
      {!loading && !error && (
        <>
        {showRandom && (
          <>
            <h2 className="text-xl font-bold text-gray-700 mb-4">You might like...</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {randomRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.length > 0 ? recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          )) : !showRandom && <p className="col-span-full text-center text-gray-500">No recipes found. Try a different search!</p>}
        </div>
        </>
      )}
    </div>
  );
};

export default Recipes;