import React from 'react';
import { Link } from 'react-router-dom';
import { RecipeCardInfo } from '../types';
import { ClockIcon, HeartIcon } from '@heroicons/react/24/outline';
import StarRating from './StarRating';

interface RecipeCardProps {
  recipe: RecipeCardInfo;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe.id}`} className="block group h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
        <div className="relative">
          <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 backdrop-blur-sm cursor-pointer">
            <HeartIcon className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <h3 className="absolute bottom-3 left-3 text-white text-lg font-semibold pr-3">
            {recipe.title}
          </h3>
        </div>
        <div className="p-4 text-sm text-gray-600 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-2">
            {recipe.readyInMinutes && (
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span>{recipe.readyInMinutes} min</span>
              </div>
            )}
            {recipe.healthScore && (
             <div className="flex items-center">
                <HeartIcon className="h-4 w-4 mr-1 text-red-400" />
                <span>Score: {recipe.healthScore}</span>
            </div>
            )}
          </div>
           {recipe.averageRating !== undefined && recipe.ratingCount !== undefined && (
            <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
               <StarRating rating={recipe.averageRating} starSize="h-4 w-4" />
               <span className="text-xs text-gray-500 ml-2">{recipe.averageRating.toFixed(1)} ({recipe.ratingCount})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;