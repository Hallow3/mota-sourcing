import { Routes } from '@angular/router';
import { HomeComponent } from './feature/public/home/home.component';


export const routes: Routes = [
    { path: '', redirectTo: 'mota', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./feature/public/login2/login.component').then(c => c.LoginComponent) },
    { path: 'register', loadComponent: () => import('./feature/public/register2/register.component').then(c => c.RegisterComponent) },
    { path: 'forgot-password', loadComponent: () => import('./feature/public/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent) },
    { path: 'reset-password', loadComponent: () => import('./feature/public/reset-password/reset-password.component').then(c => c.ResetPasswordComponent) },
    { path: 'activate', loadComponent: () => import('./feature/public/activate-account/activate-account.component').then(c => c.ActivateAccountComponent) },
    {
        path: 'mota', children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            {
                path: 'login',
                loadComponent: () => import('./feature/public/login2/login.component').then(c => c.LoginComponent),
            },
            {
                path: 'register',
                loadComponent: () => import('./feature/public/register2/register.component').then(c => c.RegisterComponent),
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./feature/public/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent),
            },
            {
                path: 'reset-password',
                loadComponent: () => import('./feature/public/reset-password/reset-password.component').then(c => c.ResetPasswordComponent),
            },
            {
                path: 'activate',
                loadComponent: () => import('./feature/public/activate-account/activate-account.component').then(c => c.ActivateAccountComponent),
            },
            { path: '**', component: HomeComponent }
        ]
    },
    { path: '**', component: HomeComponent }
];
