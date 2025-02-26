import { RecipeCardService } from '@/recipe-card/recipe-card.service';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-card',
  imports: [ RouterLink ],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  private readonly _difficultyIcon: string = "🔥";
  private readonly _ratingIcon: string = "🌟";

  private readonly _service: RecipeCardService = inject(RecipeCardService);

  @Input({ required: true }) recipeId!: number;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) image!: string;
  @Input({ required: true }) difficulty!: number;
  @Input({ required: true }) cookingTime!: string;
  @Input({ required: true }) rating!: number;

  getDifficulty(): string {
    return this._difficultyIcon.repeat(this.difficulty);
  }

  getCookingTime(): string {
    return this._service.getCookingTime(this.cookingTime);
  }

  getRating(): string {
    return this._ratingIcon.repeat(Math.round(this.rating))
  }
}
