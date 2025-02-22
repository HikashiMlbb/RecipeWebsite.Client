import { Component } from '@angular/core';
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";

@Component({
  selector: 'app-recipes-layout',
  imports: [RecipeCardComponent],
  templateUrl: './recipes-layout.component.html',
  styleUrl: './recipes-layout.component.css'
})
export class RecipesLayoutComponent {
  foo: Array<number> = Array(100);
}
