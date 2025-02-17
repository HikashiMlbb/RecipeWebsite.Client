import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { homeRoutes as HomeRoutes } from './home/home.routes';

export const routes: Routes = [
    {
        path: "", 
        children: HomeRoutes
    }
];
