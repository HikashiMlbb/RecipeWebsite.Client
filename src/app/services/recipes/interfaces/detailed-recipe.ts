import { Ingredient } from "@/services/recipes/interfaces/ingredient";
import { UserPreview } from "@/services/recipes/interfaces/user-preview";
import { Comment } from "@/services/recipes/interfaces/comment";

export interface DetailedRecipe {
    id: number;
    author: UserPreview;
    title: string;
    description: string;
    instruction: string;
    image: string;
    difficulty: number;
    cookingTime: string;
    isModifyAllowed: boolean;
    rating: number;
    votes: number;
    userRate: number;
    ingredients: Array<Ingredient>;
    comments: Array<Comment>;
}