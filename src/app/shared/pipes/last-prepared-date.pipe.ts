import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'lastPreparedDate'
})
export class LastPreparedDatePipe implements PipeTransform {
// TODO: NEEDS REVISION
  transform(value: Date, args?: any): string {
    // e.g. 26111987
    const momentDate = moment(value, 'DDMMYYYY')
    const today = moment();
    const days = today.diff(momentDate, 'days')    
    let toReturn = ''
    if(days < 0){
      const futureDays = momentDate.diff(today, 'days');
      if (futureDays === 1) {
        toReturn = 'заплановано на післязавтра'
      } else if (futureDays >= 2) {
        toReturn = `заплановано через ${futureDays} дні${futureDays >= 5 ? 'в' : ''}`
      } 
    } else if (days === 0) {
      const isSame = today.format('DDMMYYYY') === momentDate.format('DDMMYYYY')
      toReturn = isSame ? 'заплановано на сьогодні' : 'заплановано на завтра'

    } else if (days <= 1) {
      toReturn = 'вчора'
    } else if (days < 14) {
      toReturn = `${days} дні${days >= 5 ? 'в' : ''} тому`
    } else {
      const weeks = Math.round(days / 7);
      toReturn = `${weeks} тижні${weeks >= 5 ? 'в' : ''} тому`
    }
    return toReturn;
  }

}
