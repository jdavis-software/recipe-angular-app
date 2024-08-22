import { Recipe } from './models';

export const normalizeRecipe = (recipe: Recipe) => {
  // Extract the ingredients and their measurements
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '' && measure) {
      ingredients.push({ ingredient, measure });
    }
  }

  // Normalize the recipe object
  return {
    id: Number(recipe.idMeal),
    name: recipe.strMeal,
    category: recipe.strCategory,
    area: recipe.strArea,
    instructions: recipe.strInstructions,
    thumbnail: recipe.strMealThumb,
    youtube: recipe.strYoutube,
    source: recipe.strSource,
    ingredients,
  };
};
