import { inject, Injectable } from '@angular/core';
import { map, Observable, delay } from 'rxjs';
import { Recipe } from './recipe.interface'
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root', deps: [ HttpClient ] })
export class RecipeService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly backendUrl: string = "http://localhost";

  private readonly difficultyMapper: Map<number, number> = new Map([
    [1, 1],
    [2, 3],
    [3, 5]
  ]);

  constructor() {}

  fetchRecipesByPage(page: number, pageSize: number, sort: string): Observable<Array<Recipe>> {
    let observable = this.http.get<Array<Recipe>>(`${this.backendUrl}/api/recipes/page`, { params: { "page": page, "pageSize": pageSize, "sortType": sort }})
    return this.pipeResults(observable);
  }

  fetchRecipesByQuery(query: string): Observable<Array<Recipe>> {
    let observable = this.http.get<Array<Recipe>>(`${this.backendUrl}/api/recipes/search`, { params: { "query": query } });
    return this.pipeResults(observable);
  }

  private pipeResults(observable: Observable<Array<Recipe>>): Observable<Array<Recipe>> {
    return observable.pipe(
      map((recipes: Array<Recipe>): Array<Recipe> =>
        recipes.map((recipe: Recipe): Recipe => 
          ({ 
            ...recipe,
            image: `${this.backendUrl}/static/${recipe.image}?v=${Date.now()}`,
            difficulty: this.difficultyMapper.get(recipe.difficulty)!
          })))
    );
  }
}
