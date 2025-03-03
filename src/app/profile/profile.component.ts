import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  template: `
    <p>
      profile works!
    </p>
  `,
  styles: ``
})
export class ProfileComponent implements OnInit {
  private userId: number | null = null;
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly title: Title = inject(Title);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('userId')) return;

      this.title.setTitle('Профиль hikashi');
    });
  }
}
