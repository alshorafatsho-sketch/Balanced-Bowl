import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeDetails } from '../services/spoonacularService';
import { Recipe, Day, MealType } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { ClockIcon, UserGroupIcon, HeartIcon, PlusCircleIcon, BookOpenIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { MEAL_TYPES, DAYS_OF_WEEK } from '../constants';
import { saveRating, getUserRating } from '../services/ratingService';
import StarRating from '../components/StarRating';


const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useAppContext();
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [userRating, setUserRating] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeDetails(id);
        setRecipe(data);
        setUserRating(data.userRating);
      } catch (error) {
        console.error("Failed to fetch recipe details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleRatingChange = (newRating: number) => {
    if (!recipe) return;
    
    // Get the previous user rating before saving the new one
    const oldUserRating = getUserRating(recipe.id);
    
    // Save the new rating
    saveRating(recipe.id, newRating, recipe.healthScore);
    setUserRating(newRating);

    // Optimistically update the recipe state for immediate UI feedback
    setRecipe(prevRecipe => {
      if (!prevRecipe) return null;
      
      const currentTotalRating = (prevRecipe.averageRating || 0) * (prevRecipe.ratingCount || 0);
      let newTotalRating = currentTotalRating;
      let newRatingCount = prevRecipe.ratingCount || 0;

      if (oldUserRating !== undefined) {
        // User is changing their rating, so subtract old and add new
        newTotalRating = newTotalRating - oldUserRating + newRating;
      } else {
        // First-time rating by this user, add new rating and increment count
        newTotalRating += newRating;
        newRatingCount += 1;
      }

      const newAverage = newRatingCount > 0 ? newTotalRating / newRatingCount : 0;

      return {
        ...prevRecipe,
        averageRating: newAverage,
        ratingCount: newRatingCount,
      };
    });

    alert(`You rated this recipe ${newRating} stars. Thanks!`);
  };

  const addToPlanner = (day: Day, mealType: MealType) => {
    if (recipe) {
      dispatch({ type: 'ADD_TO_PLANNER', payload: { day, mealType, recipe: { id: recipe.id, title: recipe.title, image: recipe.image } } });
      setShowPlannerModal(false);
    }
  };

  const addToGroceries = () => {
    if (recipe) {
      dispatch({ type: 'ADD_TO_GROCERIES', payload: recipe.extendedIngredients });
      alert(`${recipe.title} ingredients added to your grocery list!`);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!recipe) return <div className="text-center p-8">Recipe not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative h-64 md:h-96">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <h1 className="absolute bottom-4 left-4 md:left-8 text-3xl md:text-5xl font-bold text-white">{recipe.title}</h1>
      </div>

      <div className="p-4 md:p-8 bg-white md:rounded-b-lg shadow-md">
        <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6 text-gray-600 border-b pb-4 items-center">
          <div className="flex items-center"><ClockIcon className="h-5 w-5 mr-2 text-orange-500"/> {recipe.readyInMinutes} minutes</div>
          <div className="flex items-center"><UserGroupIcon className="h-5 w-5 mr-2 text-orange-500"/> {recipe.servings} servings</div>
          <div className="flex items-center"><HeartIcon className="h-5 w-5 mr-2 text-orange-500"/> Health Score: {recipe.healthScore}</div>
           {recipe.averageRating !== undefined && recipe.ratingCount !== undefined && (
             <div className="flex items-center gap-2">
                <StarRating rating={recipe.averageRating} starSize="h-5 w-5"/>
                <span className="text-sm text-gray-500">{recipe.averageRating.toFixed(1)} ({recipe.ratingCount} ratings)</span>
             </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button onClick={() => setShowPlannerModal(true)} className="flex-1 flex justify-center items-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                <PlusCircleIcon className="h-6 w-6" /> Add to Planner
            </button>
            <button onClick={addToGroceries} className="flex-1 flex justify-center items-center gap-2 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                <ShoppingBagIcon className="h-6 w-6" /> Add to Grocery List
            </button>
            <Link to={`/cook/${recipe.id}`} className="flex-1 flex justify-center items-center gap-2 bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                <BookOpenIcon className="h-6 w-6" /> Cook Now
            </Link>
        </div>

        <div className="my-8 p-4 bg-orange-50 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Did you try this recipe?</h3>
            <p className="text-gray-600 mb-3">Rate it now!</p>
            <div className="flex justify-center">
                <StarRating
                    rating={userRating || 0}
                    onRatingChange={handleRatingChange}
                    isInteractive={true}
                    starSize="h-8 w-8"
                />
            </div>
            {userRating && <p className="text-sm text-green-600 mt-3">Thanks for your rating!</p>}
        </div>

        <div dangerouslySetInnerHTML={{ __html: recipe.summary }} className="text-gray-700 mb-8 prose" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">Ingredients</h2>
                <ul className="space-y-2">
                    {recipe.extendedIngredients.map((ing, i) => (
                        <li key={i} className="flex items-center text-gray-700">
                           <span className="h-2 w-2 bg-green-500 rounded-full mr-3"></span>
                           {ing.original}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">Instructions</h2>
                <ol className="space-y-4">
                    {recipe.analyzedInstructions[0]?.steps.map((step) => (
                        <li key={step.number} className="flex">
                            <span className="bg-orange-500 text-white rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center font-bold mr-4">{step.number}</span>
                            <p className="text-gray-700">{step.step}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>

        {/* Planner Modal */}
        {showPlannerModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                    <h3 className="text-lg font-bold mb-4">Add to Planner</h3>
                    <div className="space-y-2">
                        {DAYS_OF_WEEK.map(day => MEAL_TYPES.map(mealType => (
                            <button key={`${day}-${mealType}`} onClick={() => addToPlanner(day, mealType)} className="w-full text-left p-2 rounded hover:bg-gray-100 capitalize">
                                {day} - {mealType}
                            </button>
                        )))}
                    </div>
                    <button onClick={() => setShowPlannerModal(false)} className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded">Cancel</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;