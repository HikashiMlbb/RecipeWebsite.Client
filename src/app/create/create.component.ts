
import { RecipeConstraints } from '@/recipe-form/constraints';
import { RecipeService } from '@/services/recipes/recipe.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { RecipeFormComponent } from "../recipe-form/recipe-form.component";
import { RecipeFormData } from '@/recipe-form/recipe-form.data';
import { difficultyFromStringMapper } from '@/services/mapping.utils';

@Component({
  selector: 'app-create',
  imports: [ReactiveFormsModule, FormsModule, RecipeFormComponent],
  template: `
    <app-recipe-form
      (recipeSubmit)="onSubmit($event)"
      header="Создать рецепт"
      [initialData]="null" />
  `
})
export class CreateComponent implements OnInit {
  private readonly recipeService: RecipeService = inject(RecipeService);
  private readonly router: Router = inject(Router);
  private readonly cookieService: CookieService = inject(CookieService);

  public ngOnInit(): void {
    let isAuthorized = this.cookieService.check('Access-Token');
    if (isAuthorized) {
      return;
    }
    
    this.router.navigate([ '/login' ]);
  }

  protected onSubmit(recipe: RecipeFormData) {
    let formData = new FormData();
    let timespan = moment.duration(`${recipe.hours}:${recipe.minutes}`)

    formData.append('title', recipe.title);
    formData.append('description', recipe.description);
    formData.append('difficulty', `${recipe.difficulty}`);
    formData.append('cookingTime', `${timespan.days()}.${timespan.hours()}:${timespan.minutes()}`);
    formData.append('instruction', recipe.instruction);

    recipe.ingredients.forEach((value, index) => {
      formData.append(`ingredients[${index}].name`, value.name);
      formData.append(`ingredients[${index}].count`, `${value.count}`);
      formData.append(`ingredients[${index}].unitType`, value.type);
    })

    formData.append('image', recipe.image!);

    this.recipeService.create(formData).subscribe((recipeId: number) => {
      if (isNaN(recipeId)) {
        alert("Произошла неизвестная ошибка. Пожалуйста, попробуйте позже.");
        return;
      }

      this.router.navigate([ 'details', recipeId ]);
    })
  }
}