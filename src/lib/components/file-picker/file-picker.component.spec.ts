import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
	FilePickerComponent,
	FilePickerRejection,
} from "./file-picker.component";

function makeFile(
	name: string,
	sizeBytes: number = 4,
	type: string = "text/plain",
): File {
	return new File(["x".repeat(sizeBytes)], name, { type });
}

function dropEvent(files: File[]): DragEvent {
	const transfer = new DataTransfer();
	files.forEach((file) => transfer.items.add(file));
	return new DragEvent("drop", {
		dataTransfer: transfer,
		bubbles: true,
		cancelable: true,
	});
}

describe("FilePickerComponent", () => {
	let component: FilePickerComponent;
	let fixture: ComponentFixture<FilePickerComponent>;
	let area: HTMLElement;
	let picked: File[];
	let rejections: FilePickerRejection[];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FilePickerComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FilePickerComponent);
		component = fixture.componentInstance;
		picked = [];
		rejections = [];
		component.filePicked.subscribe((file) => picked.push(file));
		component.rejected.subscribe((rejection) => rejections.push(rejection));
		fixture.detectChanges();
		area = fixture.nativeElement.querySelector(".file-picker__area");
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("emits the dropped file and shows its name", () => {
		area.dispatchEvent(dropEvent([makeFile("data.out")]));
		fixture.detectChanges();

		expect(picked.map((file) => file.name)).toEqual(["data.out"]);
		expect(
			fixture.nativeElement.querySelector(".file-picker__file-name")
				.textContent,
		).toContain("data.out");
	});

	it("rejects a multi-file drop and keeps the current selection", () => {
		area.dispatchEvent(dropEvent([makeFile("first.out")]));
		area.dispatchEvent(dropEvent([makeFile("a.out"), makeFile("b.out")]));
		fixture.detectChanges();

		expect(picked.map((file) => file.name)).toEqual(["first.out"]);
		expect(rejections.map((rejection) => rejection.reason)).toEqual([
			"too-many",
		]);
		expect(
			fixture.nativeElement.querySelector(".file-picker__file-name")
				.textContent,
		).toContain("first.out");
	});

	it("rejects a dropped file that does not match accept", () => {
		component.accept = ".out";
		fixture.detectChanges();

		area.dispatchEvent(dropEvent([makeFile("notes.csv")]));
		fixture.detectChanges();

		expect(picked).toEqual([]);
		expect(rejections.map((rejection) => rejection.reason)).toEqual(["type"]);
		expect(
			fixture.nativeElement.querySelector(".file-picker__message").textContent,
		).toContain(".out");
	});

	it("accepts a MIME wildcard", () => {
		component.accept = "text/*";
		fixture.detectChanges();

		area.dispatchEvent(dropEvent([makeFile("notes.csv", 4, "text/csv")]));

		expect(picked.map((file) => file.name)).toEqual(["notes.csv"]);
	});

	it("accepts any file when accept is empty", () => {
		area.dispatchEvent(
			dropEvent([makeFile("anything.bin", 4, "application/octet-stream")]),
		);

		expect(picked.map((file) => file.name)).toEqual(["anything.bin"]);
	});

	it("rejects a file over maxSizeBytes", () => {
		component.maxSizeBytes = 8;
		fixture.detectChanges();

		area.dispatchEvent(dropEvent([makeFile("big.out", 16)]));

		expect(picked).toEqual([]);
		expect(rejections.map((rejection) => rejection.reason)).toEqual(["size"]);
	});

	it("ignores drops while disabled or busy", () => {
		component.disabled = true;
		fixture.detectChanges();
		area.dispatchEvent(dropEvent([makeFile("a.out")]));

		component.disabled = false;
		component.progress = 40;
		fixture.detectChanges();
		area.dispatchEvent(dropEvent([makeFile("b.out")]));

		component.progress = undefined;
		component.busy = true;
		fixture.detectChanges();
		area.dispatchEvent(dropEvent([makeFile("c.out")]));

		expect(picked).toEqual([]);
	});

	it("clears the selection", () => {
		let cleared = 0;
		component.cleared.subscribe(() => cleared++);

		area.dispatchEvent(dropEvent([makeFile("data.out")]));
		fixture.detectChanges();
		fixture.nativeElement.querySelector(".file-picker__clear").click();
		fixture.detectChanges();

		expect(cleared).toBe(1);
		expect(
			fixture.nativeElement.querySelector(".file-picker__prompt"),
		).toBeTruthy();
	});

	it("shows an indeterminate bar and no percentage when busy without progress", () => {
		area.dispatchEvent(dropEvent([makeFile("data.out")]));
		component.busy = true;
		component.busyLabel = "Uploading";
		fixture.detectChanges();

		const bar = fixture.nativeElement.querySelector(".file-picker__progress");
		expect(
			fixture.nativeElement.querySelector(".file-picker__busy").textContent,
		).toContain("Uploading data.out");
		expect(bar.hasAttribute("value")).toBe(false);
		expect(bar.matches(":indeterminate")).toBe(true);
	});

	it("shows progress instead of the prompt while busy", () => {
		area.dispatchEvent(dropEvent([makeFile("data.out")]));
		component.progress = 43;
		fixture.detectChanges();

		expect(
			fixture.nativeElement.querySelector(".file-picker__busy").textContent,
		).toContain("Reading 43% of data.out");
		expect(
			fixture.nativeElement.querySelector(".file-picker__progress").value,
		).toBe(43);
	});
});
