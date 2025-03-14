import { API_URL } from "@/services/config";

const difficultyMapper: Map<number, number> = new Map([
    [1, 1],
    [2, 3],
    [3, 5]
]);

export const mapRecipeDetails = <T extends { image: string; difficulty: number; }>(recipe: T): T => ({ 
    ...recipe,
    image: `${API_URL}/static/${recipe.image}?v=${Date.now()}`,
    difficulty: difficultyMapper.get(recipe.difficulty)!
})