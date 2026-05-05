import { Routes } from '@angular/router';
import { authGuard, redirectIfAuthedGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'register',
    canActivate: [redirectIfAuthedGuard],
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'login',
    canActivate: [redirectIfAuthedGuard],
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/new-rental/new-rental.component').then(m => m.NewRentalComponent),
  },
  { path: '**', redirectTo: '' },
];
