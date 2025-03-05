import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Recipe } from '../interfaces/recipe'
import { HttpClient } from '@angular/common/http';
import { mapRecipeDetails } from '@/services/mapping.utils';
import { API_URL } from '@/services/config';

@Injectable({ providedIn: 'root', deps: [ HttpClient ] })
export class RecipeService {
  private readonly http: HttpClient = inject(HttpClient);

  fetchRecipesByPage(page: number, pageSize: number, sort: string): Observable<Array<Recipe>> {
    let observable = this.http.get<Array<Recipe>>(`${API_URL}/api/recipes/page`, { params: { "page": page, "pageSize": pageSize, "sortType": sort }})
    return this.pipeResults(observable);
  }

  fetchRecipesByQuery(query: string): Observable<Array<Recipe>> {
    let observable = this.http.get<Array<Recipe>>(`${API_URL}/api/recipes/search`, { params: { "query": query } });
    return this.pipeResults(observable);
  }

  private pipeResults(observable: Observable<Array<Recipe>>): Observable<Array<Recipe>> {
    return observable.pipe(
      map((recipes: Array<Recipe>): Array<Recipe> =>
        recipes.map(mapRecipeDetails))
    );
  }
}
