import { Routes } from '@angular/router';
import { HomeComponent } from './feature/public/home/home.component';

export const routes: Routes = [
    {path: '', redirectTo: 'mota', pathMatch: 'full'},
    {path: 'mota', children: [
        {path: '', redirectTo: 'home',pathMatch: 'full'},
        {path: 'home', component: HomeComponent},
        {path: '**', component: HomeComponent}
    ]},
    {path: '**', component: HomeComponent}
];
