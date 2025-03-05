import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from '@/auth/login.component';
import { RegisterComponent } from '@/auth/register.component';
import { routes as profileRoutes } from '@/profile/profile.routes';
import { CreateComponent } from '@/create/create.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    {
        path: "home", 
        component: HomeComponent,
        pathMatch: "full",
        title: "Кулинарный дневник"
    },
    {
        path: "login",
        component: LoginComponent,
        pathMatch: "full",
        title: "Вход в профиль"
    },
    {
        path: "register",
        component: RegisterComponent,
        pathMatch: "full",
        title: "Регистрация профиля"
    },
    {
        path: "profile",
        children: profileRoutes
    },
    {
        path: "create",
        component: CreateComponent
    },
    {
        path: "**",
        redirectTo: "/home"
    }
];
