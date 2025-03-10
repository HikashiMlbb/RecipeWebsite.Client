import { DetailedRecipe } from '@/services/recipes/interfaces/detailed-recipe';
import { RecipeService } from '@/services/recipes/recipe.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  imports: [],
  template: `
    <p>
      details works!
    </p>
  `,
  styles: ``
})
export class DetailsComponent implements OnInit {
  protected recipe!: DetailedRecipe;

  private readonly recipeService: RecipeService = inject(RecipeService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    let recipeIdParam = this.activatedRoute.snapshot.paramMap.get('recipeId')!;
    let recipeId = Number(recipeIdParam);

    if (isNaN(recipeId)) {
      this.router.navigate([ '/home' ]);
      return;
    }

    this.recipeService.fetchById(Number(recipeId))
      .subscribe(data => data ? this.recipe = data : this.router.navigate([ '/home' ]));
  }
}
