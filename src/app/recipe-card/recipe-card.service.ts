import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({ providedIn: "root" })
export class RecipeCardService {
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
    result.push('⏳');

    if (hours > 0) {
      let subresult = '';
      subresult += `${hours} `;
      subresult += 'ч.'
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
