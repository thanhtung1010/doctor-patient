import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'environments/environment';
import * as _ from 'lodash';
import * as moment from 'moment';

@Pipe({
  name: 'dateTimeLabel'
})
export class DateTimeLabelPipe implements PipeTransform {
  constructor() { }

  getDefaultFormat() {
    const _config = environment.FORMAT_SETTING
    return _config && _config.dateTime
      ? _config.dateTime
      : `DD/MM/YYYY HH:mm:ss`;
  }
  transform(value: any, format?: string, utc: boolean = false, allowZeroValue: boolean = false, args?: any): any {
    const _format = format && !_.isEmpty(format) ? format : this.getDefaultFormat(); // default format

    if (allowZeroValue && (value < 10000 || !value
      || (!_.isUndefined(value) && `${value}`.length < 9))) {
      if (value && `${value}`.length < 9) {
        return moment(value / 1000).format(_format)
      }
      return moment(0).format(_format)
    } else {
      if (!value) return ``;
    }
    // value = _.isNumber(value) ? _.parseInt(value.toString()) : value;
    const _value = _.isNumber(value) ? _.parseInt(value.toString()) : value;

    // const _value = _.isNumber(value) && value.toString().length > 10 ? value / 1000 : value;

    let _m = utc ? moment(_value).utc() : moment(_value);

    // if (!isUnix) {
    //   _m = utc ? moment(_value).utc() : moment(_value) as moment.Moment;
    // }

    return _m.isValid() ? _m.format(_format) : ``;
  }

}
