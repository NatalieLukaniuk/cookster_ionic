import * as moment from 'moment';

export function getFormattedName(name: string): string {
  // format is 'DDMMYYYY'
  return moment(name, 'DDMMYYYY').toString();
}

export function transformDate(date: Date): string {
  return (
    getTwoDigitValue(date.getDate().toString()) +
    getTwoDigitValue((date.getMonth() + 1).toString()) +
    date.getFullYear().toString()
  );
}

export function getTwoDigitValue(value: string): string {
  if (value.length < 2) {
    return '0' + value;
  } else return value;
}