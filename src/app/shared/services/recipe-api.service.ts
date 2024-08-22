import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  forkJoin,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { Recipe, Category } from './models';

@Injectable({
  providedIn: 'root',
})
export class RecipeAPIService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';

  private http = inject(HttpClient);

  // DECLARATIVE
  categories$ = this.http.get<{ categories: Category[] }>(
    `${this.apiUrl}/categories.php`
  );

  // GET - recipes by a specific category
  selectedCategorySubject = new BehaviorSubject<string | undefined>(undefined);
  readonly selectedCategory$ = this.selectedCategorySubject.asObservable();

  recipesByCategory$ = this.selectedCategory$.pipe(
    filter(Boolean),
    switchMap((selectedCategoryName: string) => {
      const url = `${this.apiUrl}/filter.php?c=${selectedCategoryName}`;
      return this.http.get<{
        meals: Pick<Recipe, 'idMeal' | 'strMeal' | 'strMealThumb'>[];
      }>(url);
    })
  );

  // GET - recipe detail by id
  selectedRecipeSubject = new BehaviorSubject<number | undefined>(undefined);
  readonly selectedRecipe$ = this.selectedRecipeSubject.asObservable();

  selectedRecipeDetail$ = this.selectedRecipe$.pipe(
    filter(Boolean),
    switchMap((selectedRecipeId: number) => {
      const url = `${this.apiUrl}/lookup.php?i=${selectedRecipeId}`;
      return this.http.get<{
        meals: Recipe[];
      }>(url);
    })
  );

  // GET - search recipe by name
  searchRecipeByNameSubject = new BehaviorSubject<string | undefined>(
    undefined
  );
  readonly searchRecipeByName$ = this.searchRecipeByNameSubject.asObservable();

  searchResults$ = this.searchRecipeByName$.pipe(
    filter(Boolean),
    switchMap((searchValue: string) => {
      const url = `${this.apiUrl}/search.php?s=${searchValue}`;
      return this.http.get<{
        meals: Recipe[] | null;
      }>(url);
    })
  );

  getRandomRecipes(
    count: number = 10
  ): Observable<{ id: number; name: string; thumbnail: string }[]> {
    // Create an array of Observables, each calling the API for a random meal
    const requests: Observable<{ meals: Recipe[] }>[] = [];
    for (let i = 0; i < count; i++) {
      requests.push(
        this.http.get<{ meals: Recipe[] }>(`${this.apiUrl}/random.php`)
      );
    }

    // Use forkJoin to wait for all requests to complete and combine their results
    return forkJoin(requests).pipe(
      map((responses) =>
        responses.flatMap((response) => {
          if (response.meals) {
            return response.meals.map(
              ({ idMeal: id, strMeal: name, strMealThumb: thumbnail }) => ({
                id: Number(id),
                name,
                thumbnail,
              })
            );
          } else {
            return [];
          }
        })
      )
    );
  }
}
