import { inject, Injectable } from '@angular/core';
import { RecipeAPIService } from '../shared/services/recipe-api.service';
import { map, merge, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { normalizeRecipe } from '../shared/services/utility';
@Injectable({
  providedIn: 'root',
})
export class DataTransformService {
  private recipeAPI = inject(RecipeAPIService);

  // normalize the data coming back from the recipeAPI(categories)
  categories = this.recipeAPI.categories$.pipe(
    // tap((data) => console.log(data)),
    map(
      (data) =>
        data.categories.map(
          ({
            idCategory: id,
            strCategory: name,
            strCategoryThumb: image,
            strCategoryDescription: description,
          }) => ({
            id: Number(id),
            name,
            image,
            description,
          })
        ) || []
    )
  );

  // normalize recipes by category
  recipesByCategory = this.recipeAPI.recipesByCategory$.pipe(
    // tap((data) => console.log(`meals: ${JSON.stringify}`)),
    map((data) =>
      data.meals.map(
        ({ idMeal: id, strMeal: name, strMealThumb: thumbnail }) =>
          ({
            id: Number(id),
            name,
            thumbnail,
          } || [])
      )
    )
  );

  // normalize recipe detail
  selectedRecipeDetail = this.recipeAPI.selectedRecipeDetail$.pipe(
    // tap((data) => console.log(`recipe:`, data.meals[0])),
    map((data) => normalizeRecipe(data.meals[0]) || [])
  );

  // normalize search results
  filteredRecipesByName = this.recipeAPI.searchResults$.pipe(
    map((data) => {
      if (data.meals) {
        return data.meals.map((recipe) => normalizeRecipe(recipe));
      } else {
        return null;
      }
    })
  );

  recipeList = merge(
    this.recipesByCategory.pipe(startWith([])),
    this.filteredRecipesByName.pipe(startWith([]))
  ).pipe(
    switchMap((data) => {
      if (Array.isArray(data) && data.length > 0) {
        return of(data); // Return the existing data wrapped in an observable
      } else {
        return this.recipeAPI.getRandomRecipes(); // Fetch random recipes
      }
    })
  );
}
