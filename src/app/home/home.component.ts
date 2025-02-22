import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipesLayoutComponent } from "../recipes-layout/recipes-layout.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [RouterLink, RecipesLayoutComponent],
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
