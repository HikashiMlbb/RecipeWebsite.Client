import { Routes } from '@angular/router';
import { homeRoutes as HomeRoutes } from './home/home.routes';

export const routes: Routes = [
    {
        path: "home", 
        children: HomeRoutes
    },
    {
        path: "**",
        redirectTo: "/home"
    }
];
