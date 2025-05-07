// theme.service.ts
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	private currentTheme: 'light' | 'dark' = 'light'; // default
	private LIGHT_URL = 'public/static/styles/colors/colors.light.css';
	private DARK_URL = 'design-system/styles/colors/colors.dark.css';
	private themes = {
		light: this.LIGHT_URL,
		dark: this.DARK_URL,
	};
	constructor(@Inject(DOCUMENT) private document: Document) {
		// Optionally, load user preference from localStorage
		this.addThemeLink();
		const themeFromLocalStorage = localStorage.getItem('theme') as 'light' | 'dark';
		this.setTheme(themeFromLocalStorage ? themeFromLocalStorage : this.currentTheme);
	}

	private addThemeLink(): void {
		// Create a <link id="theme-css" rel="stylesheet" /> if it doesn't exist yet
		let linkEl = this.document.getElementById('theme-css') as HTMLLinkElement;
		if (!linkEl) {
			linkEl = this.document.createElement('link');
			linkEl.id = 'theme-css';
			linkEl.rel = 'stylesheet';
			this.document.head.appendChild(linkEl);
		} else {
			console.warn('theme element already exists');
		}
	}

	setTheme(theme: 'light' | 'dark'): void {
		this.currentTheme = theme;

		const linkEl = this.document.getElementById('theme-css') as HTMLLinkElement;
		if (linkEl) {
			// If your .css files are in "dist/your-app", you might just do:
			// linkEl.href = `${theme}.css`;
			// Or if they're in /assets, do "assets/light.css", "assets/dark.css", etc.
			linkEl.href = `${theme}-theme.css`;
		}

		// Optionally save user choice in localStorage
		localStorage.setItem('theme', this.currentTheme);
	}

	toggleTheme(): void {
		this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
	}
}
