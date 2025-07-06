import { Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';

export const routes: Routes = [
  {
    path: 'user-manager',
    loadComponent: () => import('./users/features/users-list/users-list.component'),
  },
  { path: '', redirectTo: '/user-manager', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
