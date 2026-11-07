import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: false
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }

    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (value >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return value.toLocaleString();
  }
}

