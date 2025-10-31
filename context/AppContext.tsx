
import React, { createContext, useReducer, ReactNode } from 'react';
import { PlannedMeal, GroceryItem, RecipeCardInfo, Ingredient, MealType, Day } from '../types';

interface AppState {
  plannedMeals: PlannedMeal[];
  groceryList: GroceryItem[];
}

type AppAction =
  | { type: 'ADD_TO_PLANNER'; payload: { day: Day; mealType: MealType; recipe: RecipeCardInfo } }
  | { type: 'REMOVE_FROM_PLANNER'; payload: { day: Day; mealType: MealType } }
  | { type: 'ADD_TO_GROCERIES'; payload: Ingredient[] }
  | { type: 'TOGGLE_GROCERY_ITEM'; payload: string }
  | { type: 'CLEAR_GROCERIES' }
  | { type: 'GENERATE_GROCERY_LIST'; payload: PlannedMeal[] }
  | { type: 'ADD_CUSTOM_GROCERY_ITEM'; payload: string }
  | { type: 'EDIT_GROCERY_ITEM'; payload: { original: string; newText: string } };

const initialState: AppState = {
  plannedMeals: [],
  groceryList: [],
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_TO_PLANNER':
      const newPlannedMeals = state.plannedMeals.filter(
        meal => !(meal.day === action.payload.day && meal.mealType === action.payload.mealType)
      );
      return {
        ...state,
        plannedMeals: [...newPlannedMeals, action.payload],
      };
    case 'REMOVE_FROM_PLANNER':
      return {
          ...state,
          plannedMeals: state.plannedMeals.filter(meal => !(meal.day === action.payload.day && meal.mealType === action.payload.mealType))
      };
    case 'ADD_TO_GROCERIES': {
      const newItems = action.payload.map(ing => ({ ...ing, checked: false }));
      const combined = [...state.groceryList];
      newItems.forEach(newItem => {
        const existing = combined.find(i => i.name === newItem.name);
        if (existing) {
          existing.amount += newItem.amount;
        } else {
          combined.push(newItem);
        }
      });
      return { ...state, groceryList: combined };
    }
    case 'TOGGLE_GROCERY_ITEM':
      return {
        ...state,
        groceryList: state.groceryList.map(item =>
          item.original === action.payload ? { ...item, checked: !item.checked } : item
        ),
      };
    case 'CLEAR_GROCERIES':
        return {
            ...state,
            groceryList: []
        };
    case 'ADD_CUSTOM_GROCERY_ITEM': {
      const newItemText = action.payload.trim();
      if (!newItemText) return state;

      const newItem: GroceryItem = {
        id: Date.now(),
        aisle: 'Uncategorized',
        image: '',
        consistency: 'solid',
        name: newItemText,
        nameClean: newItemText,
        original: newItemText,
        originalName: newItemText,
        amount: 1,
        unit: 'item',
        meta: [],
        checked: false,
      };

      if (state.groceryList.some(item => item.original.toLowerCase() === newItem.original.toLowerCase())) {
        return state; // Prevent duplicates
      }

      return {
        ...state,
        groceryList: [...state.groceryList, newItem],
      };
    }
    case 'EDIT_GROCERY_ITEM':
      return {
        ...state,
        groceryList: state.groceryList.map(item =>
          item.original === action.payload.original
            ? { ...item, name: action.payload.newText, original: action.payload.newText, nameClean: action.payload.newText, originalName: action.payload.newText }
            : item
        ),
      };
    default:
      return state;
  }
};

export const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> }>({
  state: initialState,
  dispatch: () => null,
});

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
