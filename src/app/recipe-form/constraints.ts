export const RecipeConstraints = {
  titleMinLength: 3,
  titleMaxLength: 50,
  descriptionMinLength: 50,
  descriptionMaxLength: 10000,
  minHours: 0,
  maxHours: 24 * 7 - 1,
  minMinutes: 0,
  maxMinutes: 59,
  instructionMinLength: 10,
  instructionMaxLength: 10000,
  ingredientNameMinLength: 3,
  ingredientNameMaxLength: 50,
  ingredientMinCount: 0,
  ingredientMaxCount: 1_000_000
}