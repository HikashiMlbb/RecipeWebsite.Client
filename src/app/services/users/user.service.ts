import { UserResultError } from '@/services/users/user-result-error.interface';
import { UserResult } from '@/services/users/user-result.interface';
import { User } from '@/services/users/user.interface';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = "http://localhost";

  constructor(private http: HttpClient) { }

  login(user: User): Observable<UserResult> {
    return this.http
      .post(`${this.apiUrl}/api/users/login`, { username: user.username, password: user.password }, { withCredentials: true })
      .pipe(
        map((): UserResult => ({ isOk: true, message: "" })),
        catchError((result: HttpErrorResponse): Observable<UserResult> => of({ isOk: false, message: result.error.title }))
      );
  }

  register(user: User): Observable<UserResult> {
    return this.http
      .post(`${this.apiUrl}/api/users/signup`, { username: user.username, password: user.password }, { withCredentials: true })
      .pipe(
        map((): UserResult => ({ isOk: true, message: "" })),
        catchError((result: HttpErrorResponse): Observable<UserResult> => of({ isOk: false, message: result.error.code}))
      );
  }
}
