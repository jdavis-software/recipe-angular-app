import { Component, inject, OnInit } from '@angular/core';
import { RecipeAPIService } from '../shared/services/recipe-api.service';
import { DataTransformService } from '../home-page/data-transform.service';
import { NgIf, NgFor, CommonModule, AsyncPipe } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, AsyncPipe, ButtonModule, CardModule],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
})
export class DetailPageComponent implements OnInit {
  recipeId: number | null = null;

  private route = inject(ActivatedRoute);
  private recipeAPI = inject(RecipeAPIService);
  private data = inject(DataTransformService);

  readonly details$ = this.data.selectedRecipeDetail;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('recipeId');
      if (id) {
        this.recipeId = +id; // Convert to number
        this.recipeAPI.selectedRecipeSubject.next(this.recipeId);
      }
    });
  }
  openLink(url: string): void {
    window.open(url, '_blank');
  }
}
