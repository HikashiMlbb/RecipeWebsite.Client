import { AuthFormComponent } from '@/auth-form/auth-form.component';
import { errorMap } from '@/auth/error-map';
import { UserResult } from '@/services/users/interfaces/user-result';
import { UserAuth } from '@/services/users/interfaces/user-auth';
import { UserService } from '@/services/users/user.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { API_URL } from '@/services/config';

@Component({
  selector: 'app-login',
  imports: [AuthFormComponent],
  template: `
    <app-auth-form 
      title="Вход" 
      label="Войти" 
      altLabel="ещё не зарегистрированы?"
      altLink="/register"
      [(error)]="error"
      (submit)="onSubmit($event)" />
  `,
  styles: ``
})
export class LoginComponent implements OnInit {
  protected error: string | null = null;

  private readonly service: UserService = inject(UserService);
  private readonly cookieService: CookieService = inject(CookieService);
  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    if (!this.cookieService.check('Access-Token')) return;

    this.router.navigate([ '/home' ]);
  }

  protected onSubmit(user: UserAuth) {
    this.service
      .login(user)
      .subscribe((result: UserResult) => this.handleLogin(result));
  }

  private handleLogin(result: UserResult) {
    if (result.isOk) {
      setTimeout(() => this.router.navigate([ '/home' ]), 500);
    }

    this.error = errorMap.get(result.message)!;
  }
}
