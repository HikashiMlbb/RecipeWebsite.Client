import { API_URL } from "@/services/config";

const difficultyMapper: Map<number, number> = new Map([
    [1, 1],
    [2, 3],
    [3, 5]
]);

export const difficultyFromStringMapper = new Map<string, number>([
    ["easy", 1],
    ["medium", 2],
    ["hard", 3]
]);

export const difficultyToStringMapper = new Map<number, string>([
    [1, "easy"],
    [3, "medium"],
    [5, "hard"]
]);

export const mapRecipeDetails = <T extends { image: string; difficulty: number; }>(recipe: T): T => ({ 
    ...recipe,
    image: `${API_URL}/static/${recipe.image}?v=${Date.now()}`,
    difficulty: difficultyMapper.get(recipe.difficulty)!
})