import { API_URL } from "@/services/config";
import { Recipe } from "@/services/interfaces/recipe";

const difficultyMapper: Map<number, number> = new Map([
    [1, 1],
    [2, 3],
    [3, 5]
]);

export const mapRecipeDetails = (recipe: Recipe): Recipe => ({ 
    ...recipe,
    image: `${API_URL}/static/${recipe.image}?v=${Date.now()}`,
    difficulty: difficultyMapper.get(recipe.difficulty)!
})