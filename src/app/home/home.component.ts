import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { RecipesLayoutComponent } from "../recipes-layout/recipes-layout.component";
import { finalize, filter, Observable, Subscription } from 'rxjs';
import { RecipeService } from '@/services/recipes/recipe.service';
import { Recipe } from '@/services/interfaces/recipe';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [RouterLink, RecipesLayoutComponent, InfiniteScrollDirective, FormsModule],
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild("form") form!: NgForm;
  protected readonly sortTypes = {
    popular: "popular",
    newest: "newest"
  }
  protected recipes: Array<Recipe> = [];
  protected chosenSort: string = this.sortTypes.popular;
  protected isFinished: boolean = false;
  protected query!: string;

  private readonly pageSize: number = 6;
  private readonly service: RecipeService = inject(RecipeService);
  private routerEventSubscription!: Subscription;
  private pageCounter: number = 1;
  private isQuery: boolean = false;
  private isFinalPage: boolean = false;
  private isScrolling: boolean = false;

  constructor (private router: Router) {}

  ngOnInit(): void {
    this.routerEventSubscription = this.router.events
      .pipe(filter(x => x instanceof NavigationEnd))
      .subscribe(() => window.scrollTo({ top: 0, behavior: 'smooth'}));

    this.fetchRecipes().subscribe(data => {
      this.recipes = data;
      this.isFinished = true;
    });
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
  }

  onScrolled(): void {
    if (this.isQuery || this.isFinalPage || this.isScrolling) return;
  
    this.isScrolling = true;
    this.pageCounter++;
  
    this.fetchRecipes()
      .pipe(finalize(() => this.isScrolling = false))
      .subscribe(data => {
        if (data.length < this.pageSize) this.isFinalPage = true;
        this.recipes = [...this.recipes, ...data];
      });
  }

  onSortChanged(): void {
    this.form.setValue({ "query": "" });
    this.isFinalPage = false;
    this.isFinished = false;
    this.isQuery = false;
    this.pageCounter = 1;
    this.recipes = [];

    this.fetchRecipes()
      .pipe(finalize(() => this.isFinished = true))
      .subscribe(data => this.recipes = data);
  }

  onFormSubmit(): void {
    if (!this.form.valid) return;

    this.isFinished = false;
    this.chosenSort = "";
    this.isQuery = true;
    this.recipes = [];
    this.service.fetchRecipesByQuery(this.form.value.query).subscribe(data => {
      this.recipes = data;
      this.isFinished = true;
    });
  }

  private fetchRecipes(): Observable<Array<Recipe>> {
    return this.service
      .fetchRecipesByPage(this.pageCounter, this.pageSize, this.chosenSort);
  }
}
