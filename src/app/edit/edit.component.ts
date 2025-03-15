import { Component, inject, OnInit } from '@angular/core';
import { RecipeFormComponent } from "../recipe-form/recipe-form.component";
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '@/services/recipes/recipe.service';
import { DetailedRecipe } from '@/services/recipes/interfaces/detailed-recipe';
import { RecipeFormData } from '@/recipe-form/recipe-form.data';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit',
  imports: [RecipeFormComponent, NgIf],
  template: `
    <div *ngIf="recipe">
      <app-recipe-form 
        header="Отредактировать рецепт"
        [initialData]="getInitialData"
        (recipeSubmit)="onSubmit($event)" />
    </div>
  `,
  styles: ``
})
export class EditComponent implements OnInit {
  protected recipe!: DetailedRecipe;

  private readonly cookieService: CookieService = inject(CookieService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly recipeService: RecipeService = inject(RecipeService);

  public ngOnInit(): void {
    if (!this.cookieService.check('Access-Token')) {
      this.router.navigate([ '/login' ]);
      return;
    }

    let id = Number(this.activatedRoute.snapshot.paramMap.get('recipeId'));
    if (isNaN(id)) {
      this.redirectToHome();
      return
    }

    this.recipeService.fetchById(id).subscribe(data => {
      if (!data || !data.isModifyAllowed) {
        this.redirectToHome();
        return;
      }

      this.recipe = data;
      console.debug(this.getInitialData);
    });
  }

  protected onSubmit(data: RecipeFormData): void {
    console.debug(data);
  }

  protected get getInitialData(): RecipeFormData {
    return ({
      title: this.recipe.title,
      image: null,
      description: this.recipe.description,
      difficulty: this.recipe.difficulty,
      hours: this.recipeService.getHoursFromCookingTime(this.recipe.cookingTime),
      minutes: this.recipeService.getMinutesFromCookingTime(this.recipe.cookingTime),
      ingredients: this.recipe.ingredients.map(ingredient => ({
        name: ingredient.name,
        count: ingredient.count,
        type: ingredient.measurementUnit
      })),
      instruction: this.recipe.instruction
    });
  }

  private redirectToHome(): void {
    this.router.navigate([ 'login' ]);
  }
}
