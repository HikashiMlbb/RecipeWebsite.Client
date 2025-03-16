import { TokenPayload } from '@/services/users/interfaces/token-payload';
import { UserDetailed } from '@/services/users/interfaces/user-detailed';
import { UserService } from '@/services/users/user.service';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { RecipesLayoutComponent } from "../recipes-layout/recipes-layout.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RecipesLayoutComponent, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, AfterViewInit {
  protected user!: UserDetailed;
  protected isLoading: boolean = true;
  protected isSigningOut: boolean = false;
  protected isForeign: boolean = false;

  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly cookieService: CookieService = inject(CookieService);
  private readonly title: Title = inject(Title);
  private readonly service: UserService = inject(UserService);

  private readonly renderDelayMs: number = 250;

  ngOnInit(): void {
    let hasUserId = this.activatedRoute.snapshot.paramMap.has('userId');

    if (hasUserId) {
      this.handleForeignProfile();
      return;
    }

    let isAuthorized = this.cookieService.check('Access-Token');

    if (isAuthorized) {
      this.handleMyProfile();
      return;
    }

    this.router.navigate([ '/login' ]);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.isLoading = false, this.renderDelayMs);
  }

  protected onSignOutClicked(): void {
    this.isSigningOut = true;
    this.cookieService.delete('Access-Token');
    setTimeout(() => {
      this.cookieService.check('Access-Token') ? this.isSigningOut = false : this.router.navigate([ '/login' ]);
    }, 250);
  }

  private handleForeignProfile() {
    let userId = this.activatedRoute.snapshot.paramMap.get('userId');

    if (this.cookieService.check('Access-Token')) {
      let token = this.cookieService.get('Access-Token');
      let payload = jwtDecode<TokenPayload>(token);

      if (userId == payload.sub) {
        this.handleMyProfile();
        return;
      }
    }

    this.findUserId(Number(userId));
    this.isForeign = true; 
  }

  private handleMyProfile() {
    this.isForeign = false;
    let token = this.cookieService.get('Access-Token');
    let payload = jwtDecode<TokenPayload>(token);
    this.findUserId(Number(payload.sub));
    this.title.setTitle('Мой профиль');
  }

  private findUserId(userId: number) {
    this.service.getById(userId).subscribe(data => {
      if (data === null) {
        this.router.navigate([ '/home' ]);
        return;
      }

      this.user = data;

      if (this.isForeign) this.title.setTitle('Профиль ' + this.user.username);
    });
  }
}
