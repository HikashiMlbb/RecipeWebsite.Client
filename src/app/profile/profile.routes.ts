import { Route } from "@angular/router";
import { ProfileComponent } from "@/profile/profile.component";

export const routes: Route[] = [
    {
        path: "",
        component: ProfileComponent,
        pathMatch: "full"
    },
    {
        path: ":userId",
        component: ProfileComponent,
        pathMatch: "full"
    }
]