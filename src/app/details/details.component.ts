import { DetailedRecipe } from '@/services/recipes/interfaces/detailed-recipe';
import { RecipeService } from '@/services/recipes/recipe.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-details',
  imports: [NgIf, NgFor, NgClass, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit, AfterViewInit {
  protected recipe!: DetailedRecipe;
  protected starsCount: Array<number> = new Array(5);
  protected isLoading: boolean = true;
  protected commentForm: FormGroup;
  protected isAuthenticated: boolean = false;
  protected isUserAuthor: boolean = false;
  
  private readonly recipeService: RecipeService = inject(RecipeService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly cookieService: CookieService = inject(CookieService);
  
  protected readonly maxCommentLength: number = 1500;
  private readonly renderDelayMs: number = 250;

  private currentStar: number = -1;
  private currentStarHovered: number = -1;

  constructor (fb: FormBuilder) {
    this.commentForm = fb.group({
      comment: fb.control([""], [ Validators.required, Validators.maxLength(this.maxCommentLength), Validators.pattern(/[^\s]/)])
    })
  }

  ngOnInit(): void {
    let recipeIdParam = this.activatedRoute.snapshot.paramMap.get('recipeId')!;
    let recipeId = Number(recipeIdParam);

    if (isNaN(recipeId)) {
      this.router.navigate([ '/home' ]);
      return;
    }

    this.recipeService.fetchById(Number(recipeId))
      .subscribe(data => {
        if (!data) {
          this.router.navigate([ '/home' ]);
          return;
        }

        this.recipe = data;
        this.currentStar = data.userRate - 1;
        this.isUserAuthor = data.isModifyAllowed;
      });

    this.isAuthenticated = this.cookieService.check('Access-Token');
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.isLoading = false, this.renderDelayMs);
  }

  protected viewRecipeDifficulty(): string {
    const difficultyMap: Map<number, string> = new Map([
      [1, "легкий 🔥"],
      [3, "средний 🔥🔥🔥"],
      [5, "сложный 🔥🔥🔥🔥🔥"]
    ]);

    return difficultyMap.get(this.recipe.difficulty)!;
  }

  protected viewIngredientMeasurementType(type: string): string {
    const map: Map<string, string> = new Map([
      ["grams", "грамм"],
      ["milliliters", "миллилитров"],
      ["pieces", "штук"],
      ["cups", "станаков"]
    ]);

    return map.get(type.toLowerCase())!;
  }

  protected starRateClicked(index: number): void {
    if (!this.isAuthenticated || this.isUserAuthor) return;
    this.currentStar = index == this.currentStar ? -1 : index;
 
    this.recipeService.rate(this.recipe.id, this.currentStar + 1).subscribe(star => this.currentStar = star - 1);
  }

  protected starRateHovered(index: number): void {
    if (!this.isAuthenticated || this.isUserAuthor) return;
    this.currentStarHovered = index;
  }

  protected getStarClass(index: number): boolean {
    if (this.currentStarHovered !== -1) {
      return index <= this.currentStarHovered;
    }

    return index <= this.currentStar;
  }

  protected onSubmit(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.recipeService
      .comment(this.recipe.id, this.commentForm.get('comment')!.value)
      .subscribe(comment => {
        this.recipe.comments = [ comment, ...this.recipe.comments ];
        this.commentForm.reset();
      })

  }

  protected get difficultyClasses(): object {
    return ({
      ["difficulty-easy"]: this.recipe.difficulty == 1,
      ["difficulty-medium"]: this.recipe.difficulty == 3,
      ["difficulty-hard"]: this.recipe.difficulty == 5
    });
  }

  protected get cookingTime(): string {
    return this.recipeService.getCookingTime(this.recipe.cookingTime);
  }
}
