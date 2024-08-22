import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DetailPageComponent } from './detail-page/detail-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    data: { breadcrumb: 'Home', icon: 'pi pi-home' },
  },
  {
    path: 'details/:recipeId',
    component: DetailPageComponent,
    data: { breadcrumb: 'Details', icon: 'pi pi-home' },
  },
];
