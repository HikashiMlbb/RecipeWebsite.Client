import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-card',
  imports: [],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() recipeId: number = -1;

  // Id = x.Id.Value,
  // Title = x.Title.Value,
  // Image = x.ImageName.Value,
  // Difficulty = x.Difficulty.ToString(),
  // CookingTime = x.CookingTime,
  // Rating = x.Rate.Value,
  // Votes = x.Rate.TotalVotes
}
