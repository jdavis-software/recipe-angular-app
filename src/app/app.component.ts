import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SearchComponent } from './shared/components/search/search.component';
import { RecipeAPIService } from './shared/services/recipe-api.service';
import { DataTransformService } from './home-page/data-transform.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchComponent, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Intel 471:: Recipe Book';
  private data = inject(DataTransformService);
  private recipeAPI = inject(RecipeAPIService);

  readonly searchResults$ = this.data.filteredRecipesByName;

  handleSearch(searchValue: string): void {
    console.log('Search query:', searchValue);
    this.recipeAPI.searchRecipeByNameSubject.next(searchValue || '');
  }
}
