import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { FilePickerComponent } from '../lib/components/file-picker/file-picker.component';

const meta: Meta<FilePickerComponent> = {
	title: 'Components/Inputs/File Picker',
	component: FilePickerComponent,
	decorators: [
		moduleMetadata({
			imports: [FilePickerComponent],
		}),
	],
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		hint: { control: 'text' },
		accept: { control: 'text' },
		maxSizeBytes: { control: 'number' },
		disabled: { control: 'boolean' },
		busy: { control: 'boolean' },
		progress: { control: { type: 'range', min: 0, max: 100 } },
		busyLabel: { control: 'text' },
		error: { control: 'text' },
		icon: { control: false },
	},
	parameters: {},
};

export default meta;
type Story = StoryObj<FilePickerComponent>;

export const Primary: Story = {
	args: {
		label: 'Files',
		disabled: false,
	},
};

export const Restricted: Story = {
	args: {
		label: 'Samples',
		placeholder: 'Import data.out',
		accept: '.out',
		maxSizeBytes: 10 * 1024 * 1024,
	},
};

export const Busy: Story = {
	args: {
		label: 'Samples',
		progress: 43,
		busyLabel: 'Reading',
	},
};

export const BusyIndeterminate: Story = {
	args: {
		label: 'Files',
		busy: true,
		busyLabel: 'Uploading',
	},
};

export const WithError: Story = {
	args: {
		label: 'Files',
		error: 'data.out could not be parsed.',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Files',
		disabled: true,
	},
};
