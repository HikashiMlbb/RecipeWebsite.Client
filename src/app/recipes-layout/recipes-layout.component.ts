import { Component } from '@angular/core';
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";

interface Recipe {
  id: number;
  title: string;
  image: string;
  difficulty: number;
  cookingTime: number;
  rating: number;
}

@Component({
  selector: 'app-recipes-layout',
  imports: [RecipeCardComponent],
  templateUrl: './recipes-layout.component.html',
  styleUrl: './recipes-layout.component.css'
})
export class RecipesLayoutComponent {
  recipes: Array<Recipe> = [
    {
      id: 1,
      title: "Паста Болоньезе",
      image: "https://cdn1.ozonusercontent.com/s3/club-storage/images/article_image_1632x1000/685/f6d7c2eb-4616-4d99-bdf0-0d28b62f2dce.jpeg",
      difficulty: 2,
      cookingTime: 155,
      rating: 4.7
    },
    {
      id: 2,
      title: "Томатный Суп",
      image: "https://lifehacker.ru/wp-content/uploads/2018/05/tomatnyj-sup_1525442518.jpg",
      difficulty: 3,
      cookingTime: 155,
      rating: 4.4
    },
    {
      id: 4,
      title: "Классическая яичница-глазунья",
      image: "https://s1.eda.ru/StaticContent/Photos/2/ea/2ea2a5739495455ebe732e8c42cbe453.jpg",
      difficulty: 1,
      cookingTime: 155,
      rating: 4.3
    },
    {
      id: 3,
      title: "Стрёмные Сосиски",
      image: "https://www.ermolino-produkty.ru/picts/articles/1000%D1%85750_%D0%BA%D0%B0%D0%BA_%D0%B6%D0%B0%D1%80%D0%B8%D1%82%D1%8C_%D1%81%D0%BE%D1%81%D0%B8%D1%81%D0%BA%D0%B8.jpg",
      difficulty: 1,
      cookingTime: 155,
      rating: 1.6
    }
  ];
}
