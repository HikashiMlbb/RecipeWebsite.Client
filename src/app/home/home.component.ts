import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RecipesLayoutComponent } from "../recipes-layout/recipes-layout.component";
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [RouterLink, RecipesLayoutComponent],
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private currentPath!: String
  private routerEventSubscription!: Subscription;
  
  constructor (private router: Router, private location: ActivatedRoute) {}

  ngOnInit(): void {
    this.routerEventSubscription = this.router.events
      .pipe(filter(x => x instanceof NavigationEnd))
      .subscribe(() => window.scrollTo({ top: 0, behavior: 'smooth'}));
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
  }
}
