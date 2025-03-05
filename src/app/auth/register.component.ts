import { Component, inject, OnInit } from '@angular/core';
import { AuthFormComponent } from "../auth-form/auth-form.component";
import { UserService } from '@/services/users/user.service';
import { UserAuth } from '@/services/users/interfaces/user-auth';
import { UserResult } from '@/services/users/interfaces/user-result';
import { Router } from '@angular/router';
import { errorMap } from '@/auth/error-map';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  imports: [AuthFormComponent],
  template: `
    <app-auth-form 
      title="Регистрация" 
      label="Зарегистрироваться" 
      altLabel="уже зарегистрированы?"
      altLink="/login"
      [(error)]="error"
      (submit)="onSubmit($event)" />
  `,
  styles: ``
})
export class RegisterComponent implements OnInit {
  protected error: string | null = null;

  private readonly service: UserService = inject(UserService);
  private readonly cookieService: CookieService = inject(CookieService);
  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    if (!this.cookieService.check('Access-Token')) return;

    this.redirectHome();
  }

  protected onSubmit(user: UserAuth) {
    this.service.register(user)
      .subscribe((result: UserResult) => this.handleRegistration(result));
  }
  
  private handleRegistration(result: UserResult) {
    if (result.isOk) {
      this.redirectHome();
    } 

    this.error = errorMap.get(result.message)!;
  }

  private redirectHome() {
    this.router.navigate([ '/home' ]);
  }
}
