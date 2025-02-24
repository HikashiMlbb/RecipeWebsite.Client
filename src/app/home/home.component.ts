import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RecipesLayoutComponent } from "../recipes-layout/recipes-layout.component";
import { filter, Subscription } from 'rxjs';
import { RecipeService } from '@/services/recipes/recipe.service';
import { Recipe } from '@/services/recipes/recipe.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [RouterLink, RecipesLayoutComponent],
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private currentPath!: String
  private routerEventSubscription!: Subscription;

  private service: RecipeService = inject(RecipeService);

  recipes: Array<Recipe> = [];
  
  constructor (private router: Router, private location: ActivatedRoute) {}

  ngOnInit(): void {
    this.routerEventSubscription = this.router.events
      .pipe(filter(x => x instanceof NavigationEnd))
      .subscribe(() => window.scrollTo({ top: 0, behavior: 'smooth'}));

    setTimeout(() => {
      this.service.fetchRecipesByPage(1, 1, '')
        .subscribe(data => this.recipes = data);
    }, 500);
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
  }
}
