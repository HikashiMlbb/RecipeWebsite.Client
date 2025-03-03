import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from '@/auth/login.component';
import { RegisterComponent } from '@/auth/register.component';
import { ProfileComponent } from '@/profile/profile.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    {
        path: "home", 
        component: HomeComponent,
        pathMatch: "full"
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
        component: ProfileComponent,
        pathMatch: "full",
        title: "Мой профиль"
    },
    {
        path: "profile/:userId",
        component: ProfileComponent,
        pathMatch: "full"
    },
    {
        path: "**",
        redirectTo: "/home"
    }
];
