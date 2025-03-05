import { Component, Input } from '@angular/core';
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";
import { Recipe } from '@/services/interfaces/recipe';

@Component({
  selector: 'app-recipes-layout',
  imports: [RecipeCardComponent],
  templateUrl: './recipes-layout.component.html',
  styleUrl: './recipes-layout.component.css'
})
export class RecipesLayoutComponent {
  @Input() recipes!: Array<Recipe>
  @Input() isFinished: boolean = false;
}
