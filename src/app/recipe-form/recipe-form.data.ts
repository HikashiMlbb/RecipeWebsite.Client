export interface RecipeFormData {
    title: string;
    image: File | null;
    description: string;
    difficulty: number;
    hours: number;
    minutes: number;
    ingredients: Array<RecipeFormIngredientData>;
    instruction: string;
}

export interface RecipeFormIngredientData {
    name: string;
    count: number;
    type: string;
}