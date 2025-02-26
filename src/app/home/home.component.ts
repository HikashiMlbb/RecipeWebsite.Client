import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RecipesLayoutComponent } from "../recipes-layout/recipes-layout.component";
import { filter, Observable, Subscription } from 'rxjs';
import { RecipeService } from '@/services/recipes/recipe.service';
import { Recipe } from '@/services/recipes/recipe.interface';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [RouterLink, RecipesLayoutComponent, InfiniteScrollDirective, FormsModule],
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private routerEventSubscription!: Subscription;
  private pageCounter: number = 1;
  private readonly pageSize: number = 6;
  readonly sortTypes = {
    popular: "popular",
    newest: "newest"
  }
  chosenSort: string = this.sortTypes.popular;

  private service: RecipeService = inject(RecipeService);

  recipes: Array<Recipe> = [];
  
  constructor (private router: Router) {}

  ngOnInit(): void {
    this.routerEventSubscription = this.router.events
      .pipe(filter(x => x instanceof NavigationEnd))
      .subscribe(() => window.scrollTo({ top: 0, behavior: 'smooth'}));

    this.fetchRecipes().subscribe(data => this.recipes = data)
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
  }

  onScrolled(): void {
    this.pageCounter++;
    this.fetchRecipes().subscribe(data => this.recipes = this.recipes.concat(data));
  }

  onSortChanged(): void {
    this.pageCounter = 1;
    this.fetchRecipes().subscribe(data => this.recipes = data);
  }

  private fetchRecipes(): Observable<Array<Recipe>> {
    return this.service
      .fetchRecipesByPage(this.pageCounter, this.pageSize, this.chosenSort);
  }
}
