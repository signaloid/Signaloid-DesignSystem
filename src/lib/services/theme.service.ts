// theme.service.ts
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	private currentTheme: 'light' | 'dark' = 'light'; // default
	private LIGHT_URL = 'public/static/styles/colors/colors.light.css';
	private DARK_URL = 'design-system/styles/colors/colors.dark.css';
	private device: 'desktop' | 'mobile' = 'desktop';
	private DEVICE_URL = 'public/static/styles/typography/';
	private themes = {
		light: this.LIGHT_URL,
		dark: this.DARK_URL,
	};
	private document: Document = inject(DOCUMENT);
	constructor() {
		// Optionally, load user preference from localStorage
		this.addThemeLink();
		const themeFromLocalStorage = localStorage.getItem('theme') as 'light' | 'dark';
		this.setDevice(this.device);
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
		}
	}

	private setDevice(device: 'desktop' | 'mobile') {
		this.device = device;
		const linkEl = this.document.getElementById('device-css') as HTMLLinkElement;
		if (linkEl) {
			linkEl.href = `${this.DEVICE_URL}desktop.css`;
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
