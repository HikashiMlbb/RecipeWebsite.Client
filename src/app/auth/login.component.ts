import { AuthFormComponent } from '@/auth-form/auth-form.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [AuthFormComponent],
  template: `
    <app-auth-form />
  `,
  styles: ``
})
export class LoginComponent {

}
