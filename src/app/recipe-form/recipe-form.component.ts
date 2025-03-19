import { RecipeConstraints } from '@/recipe-form/constraints';
import { isNumber } from '@/recipe-form/is-number.validator';
import { RecipeFormData } from '@/recipe-form/recipe-form.data';
import { difficultyFromStringMapper, difficultyToStringMapper } from '@/services/mapping.utils';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent implements OnInit {
  @Input({ required: true })
  public header!: string;

  @Input({ required: true })
  public initialData: RecipeFormData | null = null;
  
  @Output("recipeSubmit")
  public onSubmitEvent = new EventEmitter<RecipeFormData>();
  
  private file: File | null = null;
  
  protected isFileChosen: boolean = false;
  protected isSubmitting: boolean = false;
  protected readonly recipe: FormGroup;

  protected readonly constraints = RecipeConstraints;

  constructor (private formBuilder: FormBuilder) {
    this.recipe = formBuilder.group({
      title: ["", [ Validators.required, Validators.minLength(this.constraints.titleMinLength), Validators.maxLength(this.constraints.titleMaxLength) ]],
      image: ["", [ Validators.required ]],
      description: ["", [ Validators.required, Validators.minLength(this.constraints.descriptionMinLength), Validators.maxLength(this.constraints.descriptionMaxLength) ]],
      difficulty: ["", [ Validators.required ]],
      hours: ["", [ Validators.required, Validators.min(this.constraints.minHours), Validators.max(this.constraints.maxHours), Validators.pattern('[0-9]+') ]],
      minutes: ["", [ Validators.required, Validators.min(this.constraints.minMinutes), Validators.max(this.constraints.maxMinutes), Validators.pattern('[0-9]+') ]],
      ingredients: formBuilder.array([ ]),
      instruction: ["", [ Validators.required, Validators.minLength(this.constraints.instructionMinLength), Validators.maxLength(this.constraints.instructionMaxLength) ]]
    });
  }

  public ngOnInit(): void {
    this.recipe.patchValue({
      title: this.initialData?.title,
      image: this.initialData ? 'success' : '',
      description: this.initialData?.description,
      difficulty: difficultyToStringMapper.get(this.initialData?.difficulty ?? -1),
      hours: this.initialData?.hours,
      minutes: this.initialData?.minutes,
      instruction: this.initialData?.instruction,
    });


    this.isFileChosen = this.initialData !== null;

    if (!this.initialData) {
      this.addIngredient();
      return;
    }

    this.initialData?.ingredients.forEach(x => {
      this.addIngredient(x.name, x.count, x.type.toLowerCase());
    })
  }

  protected onFileUploaded(event: Event) {
    let htmlElement = (event.target as HTMLInputElement)!;
    this.file = htmlElement.files![0] as File;
    this.isFileChosen = true;
    this.recipe.get('image')!.setValue(this.file.name);
  }

  protected deleteIngredient() {
    if (this.ingredients.length === 1) return;
    this.ingredients.removeAt(-1);
  }

  protected addIngredient(name: string = '', count: number = 0, type: string = '') {
    this.ingredients.push(this.createIngredient(name, count, type));
  }

  protected onSubmit() {
    this.isSubmitting = true;

    if (!this.recipe.valid || !this.ingredients.controls.every(x => x.valid)) {
      this.recipe.markAllAsTouched();
      this.isSubmitting = false;
      return;

    }
    this.onSubmitEvent.emit({
      title: this.recipe.get('title')!.value,
      image: this.file,
      description: this.recipe.get('description')!.value,
      difficulty: difficultyFromStringMapper.get(this.recipe.get('difficulty')!.value)!,
      hours: this.recipe.get('hours')!.value,
      minutes: this.recipe.get('minutes')!.value,
      instruction: this.recipe.get('instruction')!.value,
      ingredients: this.ingredients.controls.map(x => x.value)
    });
  }

  private createIngredient(name: string, count: number, type: string): FormGroup {
    return this.formBuilder.group({
      name: [name, [ Validators.required, Validators.minLength(this.constraints.ingredientNameMinLength), Validators.maxLength(this.constraints.ingredientNameMaxLength) ]],
      count: [`${count == 0 ? '' : count}`, [ Validators.required, Validators.min(this.constraints.ingredientMinCount), Validators.max(this.constraints.ingredientMaxCount), isNumber() ]],
      type: [!type ? 'grams' : type]
    });
  }

  protected get ingredients(): FormArray {
    return this.recipe.get('ingredients') as FormArray;
  } 
}
