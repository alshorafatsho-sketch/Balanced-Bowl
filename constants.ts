
import { Day, MealType } from './types';

export const SPOONACULAR_API_KEY = "22338bcd18a442e8bd2ea2e65b1d0edf";
// WARNING: Storing API keys on the client-side is insecure.
// This should be proxied through a backend in a production environment.

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];
export const DAYS_OF_WEEK: Day[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
