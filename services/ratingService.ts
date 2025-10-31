import { Recipe, RecipeCardInfo } from '../types';

const RATING_STORAGE_KEY = 'recipeRatings';

interface StoredRating {
  totalRating: number;
  count: number;
  userRatings: { [userId: string]: number };
}

// Get all stored ratings from localStorage
const getStoredRatings = (): Record<string, StoredRating> => {
  try {
    const ratings = localStorage.getItem(RATING_STORAGE_KEY);
    return ratings ? JSON.parse(ratings) : {};
  } catch (error) {
    console.error("Could not parse ratings from localStorage", error);
    return {};
  }
};

// Save all ratings back to storage
const saveStoredRatings = (ratings: Record<string, StoredRating>) => {
  try {
    localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(ratings));
  } catch (error) {
    console.error("Could not save ratings to localStorage", error);
  }
};

// Simulate an initial rating based on Spoonacular's healthScore to populate the UI
const simulateInitialRating = (recipeId: number, healthScore: number): StoredRating => {
  const pseudoRandomCount = (recipeId % 50) + 5;
  const baseRating = Math.min(5, Math.max(3.5, healthScore / 20)); // Score between 3.5 and 5
  const totalRating = baseRating * pseudoRandomCount;
  return {
    totalRating,
    count: pseudoRandomCount,
    userRatings: {},
  };
};

export const saveRating = (recipeId: number, newRating: number, healthScore: number) => {
  const allRatings = getStoredRatings();
  let ratingData = allRatings[recipeId];

  if (!ratingData) {
    ratingData = simulateInitialRating(recipeId, healthScore);
  }

  const DUMMY_USER_ID = 'user1'; // Using a dummy user ID as there's no authentication
  const oldUserRating = ratingData.userRatings[DUMMY_USER_ID];

  if (oldUserRating !== undefined) {
    // User is changing their rating
    ratingData.totalRating = ratingData.totalRating - oldUserRating + newRating;
  } else {
    // User is rating for the first time
    ratingData.totalRating += newRating;
    ratingData.count += 1;
  }

  ratingData.userRatings[DUMMY_USER_ID] = newRating;
  allRatings[recipeId] = ratingData;
  saveStoredRatings(allRatings);
};

// FIX: Correct the return type to include averageRating and ratingCount, which are always returned by this function. This aligns the type signature with the implementation and resolves the TypeScript error.
export const enhanceRecipeData = <T extends Recipe | RecipeCardInfo>(recipe: T): T & { averageRating: number; ratingCount: number; userRating?: number } => {
  const allRatings = getStoredRatings();
  let ratingData = allRatings[recipe.id];
  const healthScore = recipe.healthScore ?? 0;

  if (!ratingData) {
    ratingData = simulateInitialRating(recipe.id, healthScore);
    allRatings[recipe.id] = ratingData;
    saveStoredRatings(allRatings);
  }

  const averageRating = ratingData.count > 0 ? ratingData.totalRating / ratingData.count : 0;
  
  return {
    ...recipe,
    averageRating: parseFloat(averageRating.toFixed(1)),
    ratingCount: ratingData.count,
    userRating: ratingData.userRatings['user1'],
  };
};

export const enhanceRecipeListData = <T extends Recipe | RecipeCardInfo>(recipes: T[]): T[] => {
    return recipes.map(recipe => enhanceRecipeData(recipe));
};

export const getUserRating = (recipeId: number): number | undefined => {
    const allRatings = getStoredRatings();
    return allRatings[recipeId]?.userRatings['user1'];
}