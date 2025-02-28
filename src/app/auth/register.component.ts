import { Component } from '@angular/core';
import { AuthFormComponent } from "../auth-form/auth-form.component";

@Component({
  selector: 'app-register',
  imports: [AuthFormComponent],
  template: `
    <app-auth-form />
  `,
  styles: ``
})
export class RegisterComponent {

}
