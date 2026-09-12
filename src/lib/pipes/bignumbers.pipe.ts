import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'bignumbers'
})
export class BigNumbersPipe implements PipeTransform {

	transform(value: number | string): string | number {
		let valueNumber = Number(value);
		if (valueNumber === null || valueNumber === undefined || isNaN(valueNumber)) {
			return valueNumber;
		}

		if (Math.abs(valueNumber) < 1000) {
			return valueNumber;
		}

		const units = ['k', 'M', 'B', 'T'];
		let unitIndex = -1;

		while (Math.abs(valueNumber) >= 1000 && unitIndex < units.length - 1) {
			valueNumber = valueNumber / 1000;
			unitIndex++;
		}

		return `${parseFloat(valueNumber.toFixed(1))}${units[unitIndex]}`;
	}
}
