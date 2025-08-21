import { Routes } from '@angular/router';
import { HomeComponent } from './feature/public/home/home.component';
import { GuestGuard } from './core/guard/guest.guard';
import { AdminGuard } from './core/guard/admin.guard';
import { ClientGuard } from './core/guard/client.guard';


export const routes: Routes = [
    { path: '', redirectTo: 'mota', pathMatch: 'full' },
    { path: 'login', canActivate: [GuestGuard], loadComponent: () => import('./feature/public/login/login.component').then(c => c.LoginComponent) },
    { path: 'register', canActivate: [GuestGuard], loadComponent: () => import('./feature/public/register/register.component').then(c => c.RegisterComponent) },
    { path: 'forgot-password', canActivate: [GuestGuard], loadComponent: () => import('./feature/public/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent) },
    { path: 'reset-password', canActivate: [GuestGuard], loadComponent: () => import('./feature/public/reset-password/reset-password.component').then(c => c.ResetPasswordComponent) },
    { path: 'activate', loadComponent: () => import('./feature/public/activate-account/activate-account.component').then(c => c.ActivateAccountComponent) },
    {
        path: 'mota', children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            {
                path: 'sourcing-request',
                loadComponent: () => import('./feature/public/sourcing-request-form/sourcing-request-form.component').then(c => c.SourcingRequestFormComponent),
            },
            {
                path: 'cart',
                loadComponent: () => import('./feature/public/cart/cart.component').then(c => c.CartComponent),
            },
            {
                path: 'checkout',
                loadComponent: () => import('./feature/public/checkout/checkout.component').then(c => c.CheckoutComponent),
            },
            {
                path: 'login',
                loadComponent: () => import('./feature/public/login/login.component').then(c => c.LoginComponent),
            },
            {
                path: 'register',
                loadComponent: () => import('./feature/public/register/register.component').then(c => c.RegisterComponent),
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
            {
                path: 'dashboard',
                canActivate: [ClientGuard],
                loadComponent: () => import('./feature/public/dashboard/dashboard.component').then(c => c.DashboardComponent),
            },
            { path: '**', component: HomeComponent }
        ]
    },
    {
        path: 'admin', 
        canActivate: [AdminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./feature/admin/dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
            }
        ]
    },
    { path: '**', component: HomeComponent }
];
