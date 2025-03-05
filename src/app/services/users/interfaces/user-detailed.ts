import { Recipe } from "@/services/interfaces/recipe";

export interface UserDetailed {
    id: number;
    username: string;
    role: string;
    recipes: Array<Recipe>
}