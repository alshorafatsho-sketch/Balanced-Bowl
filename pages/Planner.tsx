import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { DAYS_OF_WEEK, MEAL_TYPES } from '../constants';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { RecipeCardInfo, Day, MealType } from '../types';

const Planner: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const getMealForSlot = (day: Day, mealType: MealType) => {
    return state.plannedMeals.find(meal => meal.day === day && meal.mealType === mealType);
  };
  
  const handleRemove = (day: Day, mealType: MealType) => {
    dispatch({ type: 'REMOVE_FROM_PLANNER', payload: { day, mealType } });
  };
  
  const generateGroceryList = () => {
    alert("Generating grocery list... this is a demo feature. Add recipes to the grocery list from their detail page.");
    navigate('/groceries');
  };

  const MealCard: React.FC<{ recipe: RecipeCardInfo, onRemove: () => void }> = ({ recipe, onRemove }) => (
    <div className="relative group bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <Link to={`/recipe/${recipe.id}`} className="block h-full">
        <img src={recipe.image} alt={recipe.title} className="w-full h-24 object-cover"/>
        <div className="p-2 flex flex-col flex-grow">
            <p className="text-xs font-semibold text-gray-800 leading-tight truncate mb-2">{recipe.title}</p>
            <div className="mt-auto text-xs text-gray-500 space-y-1">
              {recipe.readyInMinutes && (
                <div className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>{recipe.readyInMinutes} min</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center">
                  <UserGroupIcon className="h-3 w-3 mr-1" />
                  <span>{recipe.servings} servings</span>
                </div>
              )}
            </div>
        </div>
      </Link>
      <button onClick={onRemove} className="absolute top-1 right-1 bg-white/70 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <XCircleIcon className="h-6 w-6"/>
      </button>
    </div>
  );

  const EmptySlot: React.FC = () => (
    <Link to="/recipes" className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
      <span className="text-2xl">+</span>
    </Link>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Meal Planner</h1>
        <button onClick={generateGroceryList} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
          Generate Grocery List
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <div className="grid grid-cols-[auto_repeat(7,minmax(150px,1fr))]">
          {/* Header row */}
          <div className="sticky left-0 bg-gray-50 z-10"></div>
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="text-center font-bold p-3 border-b border-l">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.substring(0,3)}</span>
              {state.plannedMeals.some(m => m.day === day) && (
                <div className="mx-auto mt-1 h-2 w-2 rounded-full bg-orange-500"></div>
              )}
            </div>
          ))}

          {/* Meal rows */}
          {MEAL_TYPES.map(mealType => (
            <React.Fragment key={mealType}>
              <div className="sticky left-0 bg-gray-50 z-10 p-4 font-bold capitalize flex items-center border-b">{mealType}</div>
              {DAYS_OF_WEEK.map(day => {
                const meal = getMealForSlot(day, mealType);
                return (
                  <div key={`${day}-${mealType}`} className="p-2 min-h-[170px] border-b border-l">
                    {meal ? <MealCard recipe={meal.recipe} onRemove={() => handleRemove(day, mealType)} /> : <EmptySlot />}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planner;