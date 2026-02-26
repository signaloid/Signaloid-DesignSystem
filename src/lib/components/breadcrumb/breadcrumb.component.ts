import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CarbonIconComponent } from '../icon/icon.component';

interface Breadcrumb {
	label: string;
	url: string;
	icon?: unknown;
}

@Component({
	selector: 'lib-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	imports: [CarbonIconComponent],
	styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent implements OnInit {
	breadcrumbs: Breadcrumb[] = [];
	destoedRef = inject(DestroyRef);
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) { }

	ngOnInit(): void {
		this.generateBreadcrumbs();
		this.router.events
			.pipe(
				takeUntilDestroyed(this.destoedRef),
				filter((event) => event instanceof NavigationEnd),
			)
			.subscribe(() => {
				this.generateBreadcrumbs();
			});
	}

	private generateBreadcrumbs() {
		const breadcrumbs: Breadcrumb[] = [];
		let currentRoute = this.activatedRoute.root;
		let url = '';

		while (currentRoute) {
			const children = currentRoute.children;

			if (children.length === 0) break;

			for (const child of children) {
				const routeConfig = child.routeConfig;
				const label = routeConfig?.data?.['breadcrumb'];
				const icon = routeConfig?.data?.['breadcrumbIcon'];

				const path = routeConfig?.path;

				if (path) {
					url += `/${path}`;
				}

				if (label) {
					breadcrumbs.push({ label, url, icon });
				}

				currentRoute = child;
				break; // Only follow first child
			}
		}

		this.breadcrumbs = breadcrumbs;
		console.log('Breadcrumbs:', this.breadcrumbs);
	}

	navigateTo(url: string) {
		this.router.navigate([url]);
	}
}
