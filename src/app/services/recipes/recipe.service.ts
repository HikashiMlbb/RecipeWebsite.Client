import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Recipe } from './recipe.interface'
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root', deps: [ HttpClient ] })
export class RecipeService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly difficultyMapper: Map<number, number> = new Map([
    [1, 1],
    [2, 3],
    [3, 5]
  ]);

  constructor() {}

  fetchRecipesByPage(page: number, pageSize: number, sort: string): Observable<Array<Recipe>> {
    return this.http
      .get<Array<Recipe>>('http://localhost/api/recipes/page', { params: { "page": page, "pageSize": pageSize, "sortType": sort }})
      .pipe(
        map((recipes: Recipe[]): Recipe[] => 
          recipes.map((recipe): Recipe => 
            ({ ...recipe, 
              image: `http://localhost/static/${recipe.image}?v=${Date.now()}`,
              difficulty: this.difficultyMapper.get(recipe.difficulty)!
            })))
    );

    // return of([
    //   {
    //     id: 1,
    //     title: "Паста Болоньезе",
    //     image: "https://cdn1.ozonusercontent.com/s3/club-storage/images/article_image_1632x1000/685/f6d7c2eb-4616-4d99-bdf0-0d28b62f2dce.jpeg",
    //     difficulty: 2,
    //     cookingTime: '0:15:0',
    //     rating: 4.7
    //   },
    //   {
    //     id: 2,
    //     title: "Томатный Суп",
    //     image: "https://lifehacker.ru/wp-content/uploads/2018/05/tomatnyj-sup_1525442518.jpg",
    //     difficulty: 3,
    //     cookingTime: '12:00',
    //     rating: 4.4
    //   },
    //   {
    //     id: 4,
    //     title: "Классическая яичница-глазунья",
    //     image: "https://s1.eda.ru/StaticContent/Photos/2/ea/2ea2a5739495455ebe732e8c42cbe453.jpg",
    //     difficulty: 1,
    //     cookingTime: '3.7:0:5',
    //     rating: 4.3
    //   },
    //   {
    //     id: 5,
    //     title: "W W W W W W W W W W W W W W W W W W W W W W W W WW",
    //     image: "https://lifehacker.ru/wp-content/uploads/2018/05/tomatnyj-sup_1525442518.jpg",
    //     difficulty: 3,
    //     cookingTime: '6.23:59:59',
    //     rating: 4.4
    //   },
    //   {
    //     id: 5,
    //     title: "W W W W W W W W W W W W W W W W W W W W W W W W WW",
    //     image: "https://lifehacker.ru/wp-content/uploads/2018/05/tomatnyj-sup_1525442518.jpg",
    //     difficulty: 3,
    //     cookingTime: '6.23:59:59',
    //     rating: 4.4
    //   },
    //   {
    //     id: 5,
    //     title: "W W W W W W W W W W W W W W W W W W W W W W W W WW",
    //     image: "https://lifehacker.ru/wp-content/uploads/2018/05/tomatnyj-sup_1525442518.jpg",
    //     difficulty: 3,
    //     cookingTime: '6.23:59:59',
    //     rating: 4.4
    //   }
    // ]) .pipe(
    //   map((recipes: Recipe[]): Recipe[] => 
    //     recipes.map((recipe): Recipe => 
    //       ({ ...recipe,
    //         difficulty: this.difficultyMapper.get(recipe.difficulty)!
    //       })))
    // );
  }
}
