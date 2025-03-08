import { CreateConstraints } from '@/create/create.constraints';
import { RecipeService } from '@/services/recipes/recipe.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create',
  imports: [NgFor, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit, OnDestroy {
  private file: File | null = null;

  protected recipe: FormGroup
  protected isFileChosen: boolean = false;
  protected isSubmitting: boolean = false;
  protected isFormError: boolean = false;

  private readonly cookieService: CookieService = inject(CookieService);
  private readonly recipeService: RecipeService = inject(RecipeService);
  private readonly router: Router = inject(Router);
  private readonly subscriptions: Array<Subscription> = [];

  protected readonly constraints = CreateConstraints;
  
  private readonly difficultyMapper = new Map<string, string>([
    ["easy", "1"],
    ["medium", "2"],
    ["hard", "3"]
  ]);

  constructor(private formBuilder: FormBuilder) {
    this.recipe = this.formBuilder.group({
      title: ["", [ Validators.required, Validators.minLength(this.constraints.titleMinLength), Validators.maxLength(this.constraints.titleMaxLength) ]],
      image: ["", [ Validators.required ]],
      description: ["", [ Validators.required, Validators.minLength(this.constraints.descriptionMinLength), Validators.maxLength(this.constraints.descriptionMaxLength) ]],
      difficulty: ["", [ Validators.required ]],
      hours: ["", [ Validators.required, Validators.min(this.constraints.minHours), Validators.max(this.constraints.maxHours), Validators.pattern('[0-9]+') ]],
      minutes: ["", [ Validators.required, Validators.min(this.constraints.minMinutes), Validators.max(this.constraints.maxMinutes), Validators.pattern('[0-9]+') ]],
      ingredients: this.formBuilder.array([ this.createIngredient() ]),
      instruction: ["", [ Validators.required, Validators.minLength(this.constraints.instructionMinLength), Validators.maxLength(this.constraints.instructionMaxLength) ]]
    });
  }

  protected get ingredients(): FormArray {
    return this.recipe.get('ingredients') as FormArray;
  } 

  ngOnInit(): void {
    if (!this.cookieService.check('Access-Token')) {
      this.router.navigate([ 'login' ]);
      return;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  protected onFileUploaded(event: Event) {
    let htmlElement = (event.target as HTMLInputElement)!;
    this.file = htmlElement.files![0] as File;
    this.isFileChosen = true;
    this.recipe.get('image')!.setValue(this.file.name);
  }

  protected deleteIngredient() {
    if (this.ingredients.length === 1) return;
    this.ingredients.controls = this.ingredients.controls.slice(0, -1);
  }

  protected addIngredient() {
    this.ingredients.controls = [ ...this.ingredients.controls, this.createIngredient() ];
  }

  protected onSubmit(): void {
    this.isSubmitting = true;

    if (!this.recipe.valid || !this.ingredients.controls.every(x => x.valid)) {
      this.recipe.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }

    let formData = new FormData();
    let timespan = moment.duration(`${this.recipe.get('hours')!.value}:${this.recipe.get('minutes')!.value}`)

    formData.append('title', this.recipe.get('title')!.value);
    formData.append('description', this.recipe.get('description')!.value);
    formData.append('difficulty', this.difficultyMapper.get(this.recipe.get('difficulty')!.value)!);
    formData.append('cookingTime', `${timespan.days()}.${timespan.hours()}:${timespan.minutes()}`);
    formData.append('instruction', this.recipe.get('instruction')!.value);

    this.ingredients.controls.forEach((value, index) => {
      formData.append(`ingredients[${index}].name`, value.get('name')!.value);
      formData.append(`ingredients[${index}].count`, value.get('count')!.value);
      formData.append(`ingredients[${index}].unitType`, value.get('type')!.value);
    })

    formData.append('image', this.file!);

    this.recipeService.create(formData).subscribe((recipeId: number) => {
      if (isNaN(recipeId)) {
        this.isFormError = true;
        return;
      }

      this.router.navigate([ 'details', recipeId ]);
    });
  }

  private createIngredient(): FormGroup {
    return this.formBuilder.group({
      name: ['', [ Validators.required, Validators.minLength(this.constraints.ingredientNameMinLength), Validators.maxLength(this.constraints.ingredientNameMaxLength) ]],
      count: ['', [ Validators.required, Validators.min(this.constraints.ingredientMinCount), Validators.max(this.constraints.ingredientMaxCount), this.isNumber() ]],
      type: ['grams']
    });
  }

  private isNumber(): ValidatorFn {
    return (component: AbstractControl): ValidationErrors | null => {
      let control = component as FormControl;
      return !isNaN(control.value) ? null : { IngredientCountIsNotNumber: true };
    }
  }
}