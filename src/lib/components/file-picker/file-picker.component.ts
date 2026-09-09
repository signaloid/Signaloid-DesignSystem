import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarbonIconComponent } from '../icon/icon.component';
// @ts-ignore
import CloudUpload from '@carbon/icons/es/cloud--upload/20';
// @ts-ignore
import Close from '@carbon/icons/es/close/16';

/** Why a picked file was turned away. */
let nextInputId = 0;

export type FilePickerRejectionReason = 'type' | 'size' | 'too-many';

export interface FilePickerRejection {
	reason: FilePickerRejectionReason;
	/** Every file the user offered, including the ones that were fine. */
	files: File[];
	/** Ready-to-show text; the component renders this itself unless `error` is set. */
	message: string;
}

/**
 * Click-or-drop target for a single file.
 *
 * Holds the picked file itself and shows its name in place of the prompt.
 * Set `progress` while the app reads the file to swap in a progress bar.
 */
@Component({
	selector: 'lib-file-picker',
	imports: [CarbonIconComponent],
	templateUrl: './file-picker.component.html',
	styleUrl: './file-picker.component.css',
	standalone: true,
})
export class FilePickerComponent {
	@Input() label?: string;
	@Input() placeholder: string = 'Select a file';
	@Input() hint: string = 'Drop it here or click to choose the file.';
	/** Comma-separated extensions or MIME types, as the native input takes them. Empty means any file. */
	@Input() accept: string = '';
	@Input() maxSizeBytes?: number;
	@Input() disabled: boolean = false;
	/** Shows the busy state with no percentage, for work whose length is unknown. */
	@Input() busy: boolean = false;
	/** 0-100. Shows the busy state with a filled bar, and implies `busy`. */
	@Input() progress?: number;
	@Input() busyLabel: string = 'Reading';
	/** App-level error. Takes the place of any rejection message. */
	@Input() error?: string;
	@Input() icon: unknown = CloudUpload;

	@Output() filePicked = new EventEmitter<File>();
	@Output() cleared = new EventEmitter<void>();
	@Output() rejected = new EventEmitter<FilePickerRejection>();

	protected readonly inputId = `file-picker-${nextInputId++}`;
	protected file?: File;
	protected dragging = false;
	protected rejectionMessage?: string;
	protected readonly Close = Close;
	protected readonly defaultIconColor =
		'var(--defaults-secondary-icon-secondary)';
	protected readonly disabledIconColor =
		'var(--defaults-disabled-icon-disabled)';

	get working(): boolean {
		return this.busy || this.progress !== undefined;
	}

	get determinate(): boolean {
		return this.progress !== undefined;
	}

	/** Drops and picks are both refused while a read is in flight. */
	get inert(): boolean {
		return this.disabled || this.working;
	}

	get busyText(): string {
		const percent = this.determinate ? ` ${Math.round(this.progress!)}%` : '';
		const of = this.file ? `${percent ? ' of' : ''} ${this.file.name}` : '';
		return `${this.busyLabel}${percent}${of}`;
	}

	get message(): string | undefined {
		return this.error ?? this.rejectionMessage;
	}

	onDragOver(event: DragEvent): void {
		event.preventDefault();
		this.dragging = !this.inert;
	}

	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		this.dragging = false;
	}

	onDrop(event: DragEvent): void {
		event.preventDefault();
		this.dragging = false;
		if (!this.inert) {
			this.take(Array.from(event.dataTransfer?.files ?? []));
		}
	}

	onInputChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		input.value = '';
		this.take(files);
	}

	clear(): void {
		this.file = undefined;
		this.rejectionMessage = undefined;
		this.cleared.emit();
	}

	private take(files: File[]): void {
		if (files.length === 0) {
			return;
		}
		if (files.length > 1) {
			this.reject('too-many', files, 'Only one file at a time.');
			return;
		}

		const file = files[0];
		if (!this.matchesAccept(file)) {
			this.reject('type', files, `${this.accept} files only.`);
			return;
		}
		if (this.maxSizeBytes !== undefined && file.size > this.maxSizeBytes) {
			this.reject(
				'size',
				files,
				`${file.name} is larger than ${formatBytes(this.maxSizeBytes)}.`,
			);
			return;
		}

		this.rejectionMessage = undefined;
		this.file = file;
		this.filePicked.emit(file);
	}

	private reject(
		reason: FilePickerRejectionReason,
		files: File[],
		message: string,
	): void {
		this.rejectionMessage = message;
		this.rejected.emit({ reason, files, message });
	}

	/**
	 * The native input only applies `accept` in the file dialog, so drops need the same check.
	 * Mirrors the browser rule: an extension, a MIME type, or a `type/*` wildcard.
	 */
	private matchesAccept(file: File): boolean {
		if (!this.accept.trim()) {
			return true;
		}

		return this.accept.split(',').some((raw) => {
			const pattern = raw.trim().toLowerCase();
			if (!pattern) {
				return false;
			}
			if (pattern.startsWith('.')) {
				return file.name.toLowerCase().endsWith(pattern);
			}
			if (pattern.endsWith('/*')) {
				return file.type.toLowerCase().startsWith(pattern.slice(0, -1));
			}
			return file.type.toLowerCase() === pattern;
		});
	}
}

function formatBytes(bytes: number): string {
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let value = bytes;
	let unit = 0;
	while (value >= 1024 && unit < units.length - 1) {
		value /= 1024;
		unit++;
	}
	return `${Number(value.toFixed(1))} ${units[unit]}`;
}
