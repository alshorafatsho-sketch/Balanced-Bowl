export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  extendedIngredients: Ingredient[];
  analyzedInstructions: AnalyzedInstruction[];
  nutrition: {
    nutrients: Nutrient[];
  };
  healthScore: number;
  averageRating?: number;
  ratingCount?: number;
  userRating?: number;
  cheap: boolean;
  veryHealthy: boolean;
  dishTypes: string[];
}

export interface RecipeCardInfo {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  healthScore?: number;
  calories?: number;
  averageRating?: number;
  ratingCount?: number;
  servings?: number;
}

export interface Ingredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
}

export interface AnalyzedInstruction {
  name: string;
  steps: Step[];
}

export interface Step {
  number: number;
  step: string;
  ingredients: { id: number; name: string; localizedName: string; image: string }[];
  equipment: { id: number; name: string; localizedName: string; image: string }[];
  length?: {
    number: number;
    unit: string;
  };
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface PlannedMeal {
  day: Day;
  mealType: MealType;
  recipe: RecipeCardInfo;
}

export interface GroceryItem extends Ingredient {
  checked: boolean;
}

export interface Product {
  id: number;
  title: string;
  image: string;
}