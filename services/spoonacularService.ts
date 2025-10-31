import { SPOONACULAR_API_KEY } from '../constants';
import { Recipe } from '../types';
import { enhanceRecipeData, enhanceRecipeListData } from './ratingService';


const BASE_URL = 'https://api.spoonacular.com';

const handleResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An API error occurred');
  }
  return response.json();
};

export const getRandomRecipes = async (count: number = 6): Promise<Recipe[]> => {
  const response = await fetch(`${BASE_URL}/recipes/random?number=${count}&apiKey=${SPOONACULAR_API_KEY}`);
  const data = await handleResponse<{ recipes: Recipe[] }>(response);
  return enhanceRecipeListData(data.recipes);
};

export const searchRecipes = async (query: string, diet?: string): Promise<any> => {
    let url = `${BASE_URL}/recipes/complexSearch?query=${query}&number=12&addRecipeInformation=true&apiKey=${SPOONACULAR_API_KEY}`;
    if (diet) {
        url += `&diet=${diet}`;
    }
    const response = await fetch(url);
    const data = await handleResponse<any>(response);
    data.results = enhanceRecipeListData(data.results);
    return data;
};

export const findRecipesByIngredients = async (ingredients: string[], number: number = 10): Promise<any[]> => {
  const ingredientsString = ingredients.join(',');
  const response = await fetch(`${BASE_URL}/recipes/findByIngredients?ingredients=${ingredientsString}&number=${number}&ranking=1&addRecipeInformation=true&apiKey=${SPOONACULAR_API_KEY}`);
  const data = await handleResponse<any[]>(response);
  return enhanceRecipeListData(data);
};

export const getRecipeDetails = async (id: string): Promise<Recipe> => {
  const response = await fetch(`${BASE_URL}/recipes/${id}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`);
  const data = await handleResponse<Recipe>(response);
  return enhanceRecipeData(data);
};

export const searchProducts = async (query: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/food/products/search?query=${query}&number=12&apiKey=${SPOONACULAR_API_KEY}`);
  return handleResponse<any>(response);
};