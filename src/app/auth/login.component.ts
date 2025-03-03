import { AuthFormComponent } from '@/auth-form/auth-form.component';
import { errorMap } from '@/auth/error-map';
import { UserResult } from '@/services/users/user-result.interface';
import { User } from '@/services/users/user.interface';
import { UserService } from '@/services/users/user.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

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

  private service: UserService = inject(UserService);
  private cookieService: CookieService = inject(CookieService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    if (!this.cookieService.check('Access-Token')) return;

    this.router.navigate([ '/home' ]);
  }

  protected onSubmit(user: User) {
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
