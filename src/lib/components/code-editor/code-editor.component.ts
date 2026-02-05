// monaco-editor.component.ts
import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	AfterViewInit,
	OnDestroy,
	NgZone,
} from '@angular/core';
import * as monaco from 'monaco-editor';
import { uxhw_definitions } from './models/uxhw_definitions';
import { EditorTheme, themes as themeList } from './models/themes.models';

export const kDefaultTheme: EditorTheme = 'tomorrow';
export const kDefaultDarkTheme: EditorTheme = 'solarized-dark';

type UxHwTypeSense = {
	label: string;
	functionPrototype: string;
	functionName: string;
	kind: number;
	insertText: string;
	insertTextRules: number;
	documentation: string;
	range?: monaco.IRange;
};

@Component({
	selector: 'lib-code-editor',
	templateUrl: './code-editor.component.html',
	styleUrls: ['./code-editor.component.css'],
})
export class CodeEditorComponent implements AfterViewInit, OnDestroy {
	@ViewChild('editorContainer', { static: true }) container!: ElementRef<HTMLDivElement>;

	@Input() diff = false;
	@Input() original = '';
	@Input() width = '100%';
	@Input() height = '500px';
	@Input() value = '';
	@Output() valueChange = new EventEmitter<string>();
	@Input() language = 'c';
	@Input() showUxHwSuggestions = true;
	@Input() theme: EditorTheme = kDefaultTheme;
	@Input() options: monaco.editor.IStandaloneEditorConstructionOptions = {
		fontFamily: '"IBM Plex Mono", Menlo, Monaco, "Courier New", monospace',
		fontSize: 14,
	};

	private editor?: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor;
	private resizeObs?: ResizeObserver;
	private loadedThemes: string[] = [];
	private uxhwCompletionItemProvider?: monaco.IDisposable;
	private uxhwHoverProvider?: monaco.IDisposable;
	private uxhwCompletion: UxHwTypeSense[] = [];

	constructor(private ngZone: NgZone) { }

	async ngAfterViewInit() {
		await this.loadTheme(kDefaultTheme);
		await this.loadTheme(kDefaultDarkTheme);
		this.setTheme(this.theme);

		this.ngZone.runOutsideAngular(() => {

			monaco.editor.setTheme(this.theme);

			if (this.diff) {
				const diffEditor = monaco.editor.createDiffEditor(this.container.nativeElement, {
					theme: this.theme,
					fontFamily: 'IBM Plex Mono',
					...this.options,
				});
				const origModel = monaco.editor.createModel(this.original, 'text/plain');
				const modModel = monaco.editor.createModel(this.value, this.language);
				diffEditor.setModel({ original: origModel, modified: modModel });
				this.editor = diffEditor;

				diffEditor.getModifiedEditor().onDidChangeModelContent(() => {
					const v = diffEditor.getModifiedEditor().getValue();
					this.ngZone.run(() => this.valueChange.emit(v));
				});
			} else {
				// Normal editor
				const codeEditor = monaco.editor.create(this.container.nativeElement, {
					value: this.value,
					language: this.language,
					theme: this.theme,
					automaticLayout: false,
					fontFamily: '"IBM Plex Mono", Menlo, Monaco, "Courier New", monospace',
					...this.options,
				});
				this.editor = codeEditor;
				codeEditor.onDidChangeModelContent(() => {
					const v = codeEditor.getValue();
					this.ngZone.run(() => this.valueChange.emit(v));
				});
			}

			// 3) UX-HW completion + hover
			this.uxhwCompletion = uxhw_definitions.map((x) => {
				const params = x.paramList.map((p, i) => `\${${i + 1}:${p}}`).join(',');
				return {
					label: x.functionName,
					functionPrototype: x.prototype,
					functionName: x.functionName,
					kind: monaco.languages.CompletionItemKind.Function,
					insertText: `${x.functionName}(${params})`,
					insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: x.documentation + (x.documentationUrl ? `\n\nRead more: ${x.documentationUrl}` : ''),
				} as UxHwTypeSense;
			});

			if (this.showUxHwSuggestions && !this.diff) {
				this.uxhwCompletionItemProvider = monaco.languages.registerCompletionItemProvider('*', {
					provideCompletionItems: (model, pos) => {
						const w = model.getWordUntilPosition(pos);
						const range = {
							startLineNumber: pos.lineNumber,
							endLineNumber: pos.lineNumber,
							startColumn: w.startColumn,
							endColumn: w.endColumn,
						};
						return {
							suggestions: this.uxhwCompletion.map((item) => ({
								...item,
								range,
							})),
						};
					},
				});
				this.uxhwHoverProvider = monaco.languages.registerHoverProvider(this.language, {
					provideHover: (model, pos) => {
						const word = model.getWordAtPosition(pos)?.word;
						if (!word) return null;
						const hits = this.uxhwCompletion.filter((i) => i.label.includes(word));
						if (hits.length === 1) {
							return {
								contents: [
									{ value: `**${hits[0].functionPrototype}**` },
									{ value: hits[0].documentation },
								],
							};
						}
						return null;
					},
				});
			}

			// 4) Resize observer
			this.resizeObs = new ResizeObserver(() => {
				this.editor?.layout();
			});
			this.resizeObs.observe(this.container.nativeElement);
		});
	}

	ngOnDestroy() {
		this.uxhwCompletionItemProvider?.dispose();
		this.uxhwHoverProvider?.dispose();
		this.editor?.dispose();
		this.resizeObs?.disconnect();
	}

	private async loadTheme(key: EditorTheme) {
		if (this.loadedThemes.includes(key)) return;
		const filename = themeList[key];
		console.log(filename);
		const url = new URL(`${window.location.origin}/design-system/editor-themes/${filename}.json`).href;
		console.log(url);
		const theme = await fetch(url).then(r => r.json());
		monaco.editor.defineTheme(key, theme);
		this.loadedThemes.push(key);
	}

	private setTheme(newTheme: EditorTheme) {
		this.loadTheme(newTheme).then(() => {
			monaco.editor.setTheme(newTheme);
		});
	}
}
