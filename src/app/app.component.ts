import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent],
  template: `
    <app-nav-bar />
    <div style="margin-top: 4rem; margin-bottom: 10rem;">
      <router-outlet />
    </div>
  `,
})
export class AppComponent {
  title = 'recipewebsite.client';
}
