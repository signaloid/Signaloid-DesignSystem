import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'apikey'
})
export class ApikeyPipe implements PipeTransform {
  private defaultString = '**********';
  transform(value: string, visibleCount: number = 5): unknown {
    if (!value || visibleCount < 0) return this.defaultString;
    const visible = value.slice(0, visibleCount);
    const maskedLength = value.length - visibleCount;
    const masked = '*'.repeat(maskedLength > 0 ? maskedLength : 0);
    return visible + masked;
  }

}
