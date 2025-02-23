import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-card',
  imports: [],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  private readonly _difficultyIcon: string = "🔥";
  private readonly _ratingIcon: string = "🌟";

  @Input({ required: true }) recipeId!: number;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) image!: string;
  @Input({ required: true }) difficulty!: number;
  @Input({ required: true }) cookingTime!: number;
  @Input({ required: true }) rating!: number;

  getDifficulty(): string {
    return this._difficultyIcon.repeat(this.difficulty);
  }

  getCookingTime(): string {
    return new Date(this.cookingTime).toDateString();
  }

  getRating(): string {
    return this._ratingIcon.repeat(Math.round(this.rating))
  }
}
