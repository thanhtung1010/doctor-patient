import { Pipe, PipeTransform } from '@angular/core';
import { Helpers } from 'app/_cores/_helpers';
import * as _ from 'lodash';

@Pipe({
  name: 'numberLabel'
})
export class NumberLabelPipe implements PipeTransform {

  getDecimalNotZeroValue(value: number, numberOfFloat = 2) {
    const numberFloor = Math.floor(value);
    const numberRound = Math.round(value);
    const floatAfterPoint = (value % 1).toFixed(numberOfFloat).replace(/0./, '');
    const beforePoint = Helpers.formatNumber(numberFloor, 0);

    return floatAfterPoint === '1.0' && numberOfFloat === 1
      ? numberRound
      : `${beforePoint}${+floatAfterPoint > 0 ? '.' + floatAfterPoint : ''}`;
  }

  transform(value: any, numberOfDecimal: number = 2, roundUpNotZero: boolean = false, args?: any): any {
    if (_.isNull(value) || _.isUndefined(value) || value === '') return null;

    if (roundUpNotZero) {
      return this.getDecimalNotZeroValue(value, numberOfDecimal);
    }

    return Helpers.formatNumber(value, numberOfDecimal);
  }

}
