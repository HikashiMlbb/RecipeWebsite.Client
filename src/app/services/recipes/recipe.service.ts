import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Recipe } from '../interfaces/recipe'
import { HttpClient, HttpParams } from '@angular/common/http';
import { mapRecipeDetails } from '@/services/mapping.utils';
import { API_URL } from '@/services/config';
import { DetailedRecipe } from '@/services/recipes/interfaces/detailed-recipe';
import moment from 'moment';
import { Comment } from '@/services/recipes/interfaces/comment';

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

  comment(id: number, content: string): Observable<Comment> {
    const params = new HttpParams().set('content', content);

    return this.http.post<Comment>(`${API_URL}/api/recipes/${id}/comment`, params, { withCredentials: true })
  }

  rate(id: number, star: number): Observable<number> {
    const params = new HttpParams().set('stars', star);

    return this.http.post<number>(`${API_URL}/api/recipes/${id}/rate`, params, { withCredentials: true });
  }

  delete(id: number): Observable<boolean> {
    return this.http
      .delete(`${API_URL}/api/recipes/${id}`, { withCredentials: true })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  update(id: number, data: FormData): Observable<boolean> {
    return this.http
      .put(`${API_URL}/api/recipes/${id}`, data, { withCredentials: true })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  getCookingTime(cookingTime: string): string {
    let duration = moment.duration(cookingTime);
    let result: Array<string> = [];
    let hours = Math.floor(duration.asHours());
    let minutes = Math.ceil(duration.asMinutes()) - hours * 60;
    result.push('⏳');

    if (hours > 0) {
      let subresult = '';
      subresult += `${hours} `;
      subresult += 'ч.'
      result.push(subresult);
    }

    if (minutes > 0) {
      let subresult = '';
      subresult += `${minutes} `;
      subresult += this._minuteCallMap.get(minutes) || this._minuteCallMap.get(minutes % 10);
      result.push(subresult);
    }
    
    return result.join(' ');
  }

  getHoursFromCookingTime(cookingTime: string): number {
    return Math.floor(moment.duration(cookingTime).asHours());
  }

  getMinutesFromCookingTime(cookingTime: string): number {
    let duration = moment.duration(cookingTime);
    let hours = Math.floor(duration.asHours());
    return Math.ceil(duration.asMinutes()) - hours * 60;
  }

  private pipeResults(observable: Observable<Array<Recipe>>): Observable<Array<Recipe>> {
    return observable.pipe(
      map((recipes: Array<Recipe>): Array<Recipe> =>
        recipes.map(mapRecipeDetails))
    );
  }

  private _minuteCallMap = new Map([
    [0, "минут"],
    [1, "минута"],
    [2, "минуты"],
    [3, "минуты"],
    [4, "минуты"],
    [5, "минут"],
    [6, "минут"],
    [7, "минут"],
    [8, "минут"],
    [9, "минут"],
    [10, "минут"],
    [11, "минут"],
    [12, "минут"],
    [13, "минут"],
    [14, "минут"]
  ]);
}
