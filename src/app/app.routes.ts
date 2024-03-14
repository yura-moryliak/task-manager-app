import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./domains/tasks/tasks.component')
      .then((cmp) => cmp.TasksComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./domains/users/users.component')
      .then((cmp) => cmp.UsersComponent)
  },
  {
    path: '**',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  }
];
