import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({ providedIn: "root" })
export class RecipeCardService {
  private _hourCallMap = new Map([
    [0, "часов"],
    [1, "час"],
    [2, "часа"],
    [3, "часа"],
    [4, "часа"],
    [5, "часов"],
    [6, "часов"],
    [7, "часов"],
    [8, "часов"],
    [9, "часов"],
    [10, "часов"],
    [11, "часов"],
    [12, "часов"],
    [13, "часов"],
    [14, "часов"]
  ]);

  private _minuteCallMap = new Map([
    [0, "минут"],
    [1, "минута"],
    [2, "минуты"],
    [3, "минуты"],
    [4, "минуты"],
    [5, "минут"],
    [6, "минут"],
    [7, "минут"],
    [8, "минут"],
    [9, "минут"],
    [10, "минут"],
    [11, "минут"],
    [12, "минут"],
    [13, "минут"],
    [14, "минут"]
  ]);

  getCookingTime(cookingTime: string): string {
    let duration = moment.duration(cookingTime);
    let result: Array<string> = [];
    let hours = Math.floor(duration.asHours());
    let minutes = Math.ceil(duration.asMinutes()) - hours * 60;

    if (hours > 0) {
      let subresult = '';
      subresult += `${hours} `;
      subresult += this._hourCallMap.get(hours) || this._hourCallMap.get(hours.toString().length == 3 ? hours % 100 : hours % 10) || this._hourCallMap.get(hours % 10);
      result.push(subresult);
    }

    if (minutes > 0) {
      let subresult = '';
      subresult += `${minutes} `;
      subresult += this._minuteCallMap.get(minutes) || this._minuteCallMap.get(minutes % 10);
      result.push(subresult);
    }
    
    return result.join(' ');
  }
}
