import {
  Component,
  inject,
  signal,
  effect,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { CardModule } from 'primeng/card';

import { DataTransformService } from './data-transform.service';
import { Router } from '@angular/router'; // Import Router
import { RecipeAPIService } from '../shared/services/recipe-api.service';
import { NgIf, NgFor, CommonModule, AsyncPipe } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    AsyncPipe,
    ChipModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private data = inject(DataTransformService);
  private recipeAPI = inject(RecipeAPIService);
  private router = inject(Router);

  readonly categories$ = this.data.categories;
  readonly recipeList$ = this.data.recipeList;

  onHandleCategoryClick(categoryName: string) {
    console.log(`category name: ${categoryName}`);
    this.recipeAPI.selectedCategorySubject.next(categoryName);
  }

  onHandleRecipeClick(recipeId: number) {
    console.log(`recipeId`, recipeId);
    this.router.navigate([`details/${recipeId}`]); // Navigate to details page
  }
}
