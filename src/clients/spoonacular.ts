import axios from "axios";

export type Ingredient = {
  id: number;
};

export type RecipeSearchResult = {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: Ingredient[];
  usedIngredients: Ingredient[];
  unusedIngredients: Ingredient[];
  likes: number;
};

export type RecipesSearchParams = {
  ingredients: string[];
  number?: number;
  ranking?: number;
  ignorePantry?: boolean;
};

export type RecipeIngredient = {
  id: number;
  image: string;
  name: string;
};

export type RecipeStep = {
  number: number;
  step: string;
  ingredients: RecipeIngredient[];
  equipment: string[];
  length: Record<string, unknown>;
};

export type RecipeAnalyzedInstruction = {
  name: string;
  steps: RecipeStep[];
};

export type RecipeInformation = {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image: string;
  imageType: string;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  winePairing: Record<string, unknown>;
  instructions: string;
  analyzedInstructions: RecipeAnalyzedInstruction[];
  originalId: number | null;
};

export interface IClient {
  searchRecipesByIngredients(searchParams: RecipesSearchParams): Promise<RecipeSearchResult[]>;
  searchRecipeInformation(id: number): Promise<RecipeInformation>;
}

function createClient(): IClient {
  const httpClient = axios.create();
  const baseUrl = process.env.SPOONACULAR_API_URL as string;

  async function sendRequest(url: string, params?: Record<string, unknown>) {
    try {
      const axiosResponse = await httpClient.get(url, { params });
      return axiosResponse.data;
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      throw err;
    }
  }

  function searchRecipesByIngredients({
    ingredients,
    number = 5,
    ranking = 1,
    ignorePantry = true,
  }: RecipesSearchParams): Promise<RecipeSearchResult[]> {
    const path = "recipes/findByIngredients";
    const url = `${baseUrl}/${path}`;
    const params = {
      ingredients: ingredients.join(","),
      number,
      ranking,
      ignorePantry,
      apiKey: process.env.SPOONACULAR_API_KEY,
    };
    return sendRequest(url, params);
  }

  function searchRecipeInformation(id: number): Promise<RecipeInformation> {
    const path = `recipes/${id}/information`;
    const url = `${baseUrl}/${path}`;
    const params = {
      apiKey: process.env.SPOONACULAR_API_KEY,
    };
    return sendRequest(url, params);
  }

  return {
    searchRecipesByIngredients,
    searchRecipeInformation,
  };
}

export const client = createClient();
export default createClient;
