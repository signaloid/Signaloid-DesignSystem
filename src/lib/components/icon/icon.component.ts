import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'lib-icon',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			[style.color]="color ? color : 'var(--defaults-secondary-icon-secondary)'"
			[style.width]="size.width"
			[style.height]="size.height"
			style="display: flex; align-items: center; justify-content: center;"
			[innerHTML]="svgContent"
		></div>
	`,
})
export class CarbonIconComponent implements OnChanges, OnInit {
	@Input() icon: unknown = undefined;
	@Input() size: { width: string; height: string } = { width: '20px', height: '20px' };
	@Input() color: string = 'var(--defaults-secondary-icon-secondary)';
	svgContent?: SafeHtml;
	constructor(
		private sanitizer: DomSanitizer,
		private cd: ChangeDetectorRef,
	) { }

	ngOnInit(): void { }

	ngOnChanges(): void {
		if (this.icon) {
			const svgMarkup = this.generateSvgHtml(this.icon);
			this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svgMarkup);
			this.cd.markForCheck();
		}
	}

	private generateSvgHtml(iconDef: any): string {
		const { elem, attrs, content = [] } = iconDef;
		const attrString = Object.entries(attrs ?? {})
			.map(([key, val]) => `${key}="${val}"`)
			.join(' ');

		const inner = content.map((child: any) => this.generateSvgHtml(child)).join('');
		return `<${elem} ${attrString}>${inner}</${elem}>`;
	}
}
/**
 * A standalone component that takes a Carbon icon object
 * for Icon names and etc info look at -> https://carbon-elements.netlify.app/icons/examples/preview/
 */
