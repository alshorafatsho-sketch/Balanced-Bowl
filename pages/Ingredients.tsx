import React, { useState, useCallback, useEffect } from 'react';
import { findRecipesByIngredients } from '../services/spoonacularService';
import RecipeCard from '../components/RecipeCard';
import { RecipeCardInfo } from '../types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const dietaryFilters = ["Vegetarian", "Vegan", "Gluten Free", "Ketogenic", "Pescetarian"];
const cuisineFilters = ["Italian", "Mexican", "Chinese", "Indian", "Thai", "Japanese"];

const Ingredients: React.FC = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<RecipeCardInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [activeDiet, setActiveDiet] = useState<string | null>(null);
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);

  const performSearch = useCallback(async (
    currentQuery: string,
    diet: string | null,
    cuisine: string | null
  ) => {
    const ingredients = currentQuery.split(',').map(ing => ing.trim()).filter(Boolean);
    if (ingredients.length === 0) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const results = await findRecipesByIngredients(ingredients, 12, diet, cuisine);
      setRecipes(results);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query, activeDiet, activeCuisine);
    }
  };

  const handleDietClick = (diet: string) => {
    const newDiet = activeDiet === diet ? null : diet;
    setActiveDiet(newDiet);
    if (query.trim()) {
      performSearch(query, newDiet, activeCuisine);
    }
  };

  const handleCuisineClick = (cuisine: string) => {
    const newCuisine = activeCuisine === cuisine ? null : cuisine;
    setActiveCuisine(newCuisine);
    if (query.trim()) {
      performSearch(query, activeDiet, newCuisine);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Find by Ingredients</h1>
      <p className="text-gray-600 mb-6">Got some ingredients? Find out what you can make!</p>
      
      <form onSubmit={handleSearch} className="flex items-center mb-4 bg-white rounded-full shadow-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., chicken, broccoli, rice"
          className="w-full bg-transparent px-6 py-3 text-gray-700 focus:outline-none"
        />
        <button type="submit" className="p-3 bg-blue-500 text-white rounded-full m-1 hover:bg-blue-600">
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </form>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Dietary Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {dietaryFilters.map(diet => (
              <button key={diet} onClick={() => handleDietClick(diet)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeDiet === diet ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  {diet}
              </button>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Cuisine</h3>
        <div className="flex flex-wrap gap-2">
          {cuisineFilters.map(cuisine => (
              <button key={cuisine} onClick={() => handleCuisineClick(cuisine)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeCuisine === cuisine ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  {cuisine}
              </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center p-8">Searching for recipes...</div>}
      {error && <div className="text-center p-8 text-red-500">{error}</div>}
      
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.length > 0 ? recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          )) : searched && <p className="col-span-full text-center text-gray-500">No recipes found with those ingredients and filters. Try a different combination!</p>}
        </div>
      )}
    </div>
  );
};

export default Ingredients;