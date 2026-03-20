import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnDestroy,
	computed,
	Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

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

import {
	EditorComponent,
	DiffEditorComponent,
	DiffEditorModel
} from 'ngx-monaco-editor-v2';

@Component({
	selector: 'lib-code-editor',
	templateUrl: './code-editor.component.html',
	styleUrls: ['./code-editor.component.css'],
	imports: [
		FormsModule,
		EditorComponent,
		DiffEditorComponent
	]
})
export class CodeEditorComponent implements OnDestroy {
	@Input() value: string = '';
	@Input() language: string = 'c';
	@Input() width: string = '100%';
	@Input() height: string = '500px';
	@Input() diff: boolean = false;
	@Input() original: string = '';
	@Input() theme: EditorTheme = kDefaultTheme;
	@Input() inputEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
		fontFamily: '"IBM Plex Mono", Menlo, Monaco, "Courier New", monospace',
		fontSize: 14,
		automaticLayout: true,
	};
	@Input() showUxHwSuggestions: boolean = true;
	@Output() valueChange = new EventEmitter<string>();

	originalModel: Signal<DiffEditorModel> = computed(() => ({
		code: this.original,
		language: this.language
	}));

	modifiedModel: Signal<DiffEditorModel> = computed(() => ({
		code: this.value,
		language: this.language
	}));

	editorOptions: Signal<monaco.editor.IStandaloneEditorConstructionOptions> = computed(() => ({
		theme: this.theme,
		language: this.language,
		...this.inputEditorOptions
	}));

	private monacoEditorModule: any;
	private editor: any;
	private loadedThemes: string[] = [];
	private uxhwCompletionItemProvider?: monaco.IDisposable;
	private uxhwHoverProvider?: monaco.IDisposable;

	onMonacoEditorInit(editor: any) {
		this.editor = editor;
		this.monacoEditorModule = (window as any).monaco;

		this.setTheme(this.theme);
		this.setValueChangeEmitter();
		this.initUxHwSuggestions();
	}

	private async loadTheme(key: EditorTheme) {
		if (this.loadedThemes.includes(key)) {
			return;
		}

		const filename = themeList[key];
		const url = new URL(`${window.location.origin}/design-system/editor-themes/${filename}.json`).href;
		const theme = await fetch(url).then(r => r.json());

		this.monacoEditorModule.editor.defineTheme(key, theme);

		this.loadedThemes.push(key);
	}

	private setTheme(newTheme: EditorTheme) {
		this.loadTheme(newTheme).then(() => {
			this.monacoEditorModule.editor.setTheme(newTheme);
		});
	}

	private setValueChangeEmitter() {
		if (this.diff) {
			this.editor.onDidUpdateDiff(() => {
				const v = this.editor.getModel().modified.getValue();
				this.valueChange.emit(v);
			});
		} else {
			this.editor.onDidChangeModelContent(() => {
				const v = this.editor.getValue();
				this.valueChange.emit(v);
			});
		}
	}

	private uxhwCompletion: UxHwTypeSense[] = uxhw_definitions.map((x) => {
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

	private initUxHwSuggestions() {
		if (this.diff) {
			return;
		}

		if (!this.showUxHwSuggestions) {
			return;
		}

		this.uxhwCompletionItemProvider = this.monacoEditorModule.languages.registerCompletionItemProvider('*', {
			provideCompletionItems: (model: any, pos: any) => {
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

		this.uxhwHoverProvider = this.monacoEditorModule.languages.registerHoverProvider(this.language, {
			provideHover: (model: any, pos: any) => {
				const word = model.getWordAtPosition(pos)?.word;
				if (!word) {
					return null;
				}

				const hits = this.uxhwCompletion.filter((i) => i.label.includes(word));
				if (hits.length !== 1) {
					return null;
				}

				return {
					contents: [
						{ value: `**${hits[0].functionPrototype}**` },
						{ value: hits[0].documentation },
					],
				};
			},
		});
	}

	ngOnDestroy() {
		this.uxhwCompletionItemProvider?.dispose();
		this.uxhwHoverProvider?.dispose();
		this.editor?.dispose();
	}
}
