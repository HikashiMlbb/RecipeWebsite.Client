import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Recipe } from '../interfaces/recipe'
import { HttpClient } from '@angular/common/http';
import { mapRecipeDetails } from '@/services/mapping.utils';
import { API_URL } from '@/services/config';
import { DetailedRecipe } from '@/services/recipes/interfaces/detailed-recipe';

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

  create(data: FormData): Observable<number> {
    return this.http
      .post<number>(`${API_URL}/api/recipes`, data, { withCredentials: true })
      .pipe(
        catchError((): Observable<number> => of(NaN))
      );
  }

  fetchById(id: number): Observable<DetailedRecipe | null> {
    return this.http
      .get<DetailedRecipe>(`${API_URL}/api/recipes/${id}`, { withCredentials: true })
      .pipe(
        map((recipe): DetailedRecipe => mapRecipeDetails(recipe)),
        catchError(() => of(null))
      )
  }

  private pipeResults(observable: Observable<Array<Recipe>>): Observable<Array<Recipe>> {
    return observable.pipe(
      map((recipes: Array<Recipe>): Array<Recipe> =>
        recipes.map(mapRecipeDetails))
    );
  }
}
