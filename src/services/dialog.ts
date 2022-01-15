import prompts from "prompts";
import { client as spoonacularClient } from "../clients/spoonacular";

export type DialogService = {
  start(): Promise<void>;
};

enum Ingredient {
  EGGPLANT = "eggplant",
  ZUCHINI = "zucchini",
  CHICKPEA = "chickpea",
}

enum Cuisine {
  JAPANESE = "japanese",
  ITALIAN = "italian",
  MIDDLE_EAST = "middle-east",
  UNKNOWN = "unknown",
}

enum Gender {
  MALE = "M",
  FEMALE = "F",
}

enum Meal {
  BREAKFAST = "Breakfast",
  LUNCH = "Lunch",
  DINNER = "Dinner",
  SNACK = "Snack",
}

enum Prompts {
  INGREDIENTS = "ingredients",
  MEAL = "meal",
  CUISINE = "cuisine",
  GENDER = "gender",
  RECIPE = "recipe",
}

/* eslint-disable no-console */
function createDialogService(): DialogService {
  const introQuestions: prompts.PromptObject[] = [
    {
      type: "select",
      name: Prompts.GENDER,
      message: "Select gender:",
      choices: [
        { title: "Male", value: Gender.MALE },
        { title: "Female", value: Gender.FEMALE },
      ],
    },
    {
      type: "select",
      name: Prompts.MEAL,
      message: "Select type of meal:",
      choices: [
        { title: "Breakfast", value: Meal.BREAKFAST },
        { title: "Lunch", value: Meal.LUNCH },
        { title: "Dinner", value: Meal.DINNER },
        { title: "Snack", value: Meal.SNACK },
      ],
    },
    {
      type: "select",
      name: Prompts.CUISINE,
      message: "Select cuisine:",
      choices: [
        { title: "Japanese", value: Cuisine.JAPANESE },
        { title: "Italian", value: Cuisine.ITALIAN },
        { title: "Middle-east", value: Cuisine.MIDDLE_EAST },
        { title: "No preference", value: Cuisine.UNKNOWN },
      ],
    },
    {
      type: "multiselect",
      name: Prompts.INGREDIENTS,
      message: "Select ingredients:",
      choices: [
        { title: "Zucchini", value: Ingredient.ZUCHINI },
        { title: "Chickpea", value: Ingredient.CHICKPEA },
        { title: "Eggplant", value: Ingredient.EGGPLANT },
      ],
    },
  ];

  function createSelectPrompt(
    name: string,
    message: string,
    choices: prompts.Choice[]
  ): prompts.PromptObject<string> {
    return {
      type: "select",
      name,
      message,
      choices,
    };
  }

  async function onCancel() {
    console.log("Sorry that you are leaving");
  }

  async function onSubmit(prompt: prompts.PromptObject, answer: string) {
    console.log(`Prompt: ${prompt.name} | Answer submitted: ${answer}`);
  }

  async function start(): Promise<void> {
    const { ingredients } = await prompts(introQuestions, { onCancel, onSubmit });

    const recipes = await spoonacularClient.searchRecipesByIngredients({ ingredients });
    const recipeChoices = recipes.map((recipe) => ({ title: recipe.title, value: recipe.id }));
    const recipeQuestion = createSelectPrompt(Prompts.RECIPE, "Select recipe:", recipeChoices);

    const { recipe } = await prompts(recipeQuestion);
    const recipeInformation = await spoonacularClient.searchRecipeInformation(recipe);

    recipeInformation.analyzedInstructions.forEach((instruction) => {
      instruction.steps.forEach((step) => {
        console.log(`${step.number}. ${step.step}`);
        console.log(
          `Ingredients: ${step.ingredients.map((ingredient) => ingredient.name).join(", ")}`
        );
      });
    });
  }

  return {
    start,
  };
}

export const dialogService = createDialogService();
export default createDialogService;
