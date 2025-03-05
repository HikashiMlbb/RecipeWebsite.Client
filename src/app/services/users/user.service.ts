import { UserResult } from '@/services/users/interfaces/user-result';
import { UserAuth } from '@/services/users/interfaces/user-auth';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { UserDetailed } from '@/services/users/interfaces/user-detailed';
import { Recipe } from '@/services/interfaces/recipe';
import { mapRecipeDetails } from '@/services/mapping.utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = "http://localhost";
  private readonly difficultyMapper: Map<number, number> = new Map([
    [1, 1],
    [2, 3],
    [3, 5]
  ]);

  constructor(private http: HttpClient) { }

  login(user: UserAuth): Observable<UserResult> {
    return this.http
      .post(`${this.apiUrl}/api/users/login`, { username: user.username, password: user.password }, { withCredentials: true })
      .pipe(
        map((): UserResult => ({ isOk: true, message: "" })),
        catchError((result: HttpErrorResponse): Observable<UserResult> => of({ isOk: false, message: result.error.title }))
      );
  }

  register(user: UserAuth): Observable<UserResult> {
    return this.http
      .post(`${this.apiUrl}/api/users/signup`, { username: user.username, password: user.password }, { withCredentials: true })
      .pipe(
        map((): UserResult => ({ isOk: true, message: "" })),
        catchError((result: HttpErrorResponse): Observable<UserResult> => of({ isOk: false, message: result.error.code}))
      );
  }

  getById(userId: number): Observable<UserDetailed | null> {
    return this.http
      .get<UserDetailed | null>(`${this.apiUrl}/api/users/${userId}`)
      .pipe(
        map((user: UserDetailed | null): UserDetailed | null => {
          if (user === null) return null;

          user.recipes = user.recipes.map(mapRecipeDetails)
          return user;
        }),
        catchError((): Observable<UserDetailed | null> => of(null))
      );
  }
}
