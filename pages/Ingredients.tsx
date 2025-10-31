import React, { useState } from 'react';
import { findRecipesByIngredients } from '../services/spoonacularService';
import RecipeCard from '../components/RecipeCard';
import { RecipeCardInfo } from '../types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const Ingredients: React.FC = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<RecipeCardInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const ingredients = query.split(',').map(ing => ing.trim()).filter(Boolean);
    if (ingredients.length === 0) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const results = await findRecipesByIngredients(ingredients);
      setRecipes(results);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Find by Ingredients</h1>
      <p className="text-gray-600 mb-6">Got some ingredients? Find out what you can make!</p>
      
      <form onSubmit={handleSearch} className="flex items-center mb-8 bg-white rounded-full shadow-md">
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

      {loading && <div className="text-center p-8">Searching for recipes...</div>}
      {error && <div className="text-center p-8 text-red-500">{error}</div>}
      
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.length > 0 ? recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          )) : searched && <p className="col-span-full text-center text-gray-500">No recipes found with those ingredients. Try a different combination!</p>}
        </div>
      )}
    </div>
  );
};

export default Ingredients;
