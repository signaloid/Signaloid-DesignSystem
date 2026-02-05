import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { CarbonIconComponent } from '../lib/components';
// Import an example icon for the leftIcon input.
// @ts-ignore
import Add16 from '@carbon/icons/es/watson-health/3D-curve--auto-vessels/20';
import { InputTextComponent } from '../lib/components/input-text/input-text.component';
import { InputTextSize } from '../lib/components/input-text/input-text.models';

const meta: Meta<InputTextComponent> = {
	title: 'Components/Inputs/Text',
	component: InputTextComponent,
	decorators: [
		moduleMetadata({
			imports: [CarbonIconComponent, InputTextComponent],
		}),
	],
	argTypes: {
		placeholder: { control: 'text' },
		minLength: { control: 'number' },
		leftIcon: { control: false },
		size: {
			control: 'select',
			options: Object.values(InputTextSize),
		},
		pattern: { control: 'text' },
		label: { control: 'text' },
		disabled: { control: 'boolean' },
	},
	parameters: {},
};

export default meta;
type Story = StoryObj<InputTextComponent>;

export const Primary: Story = {
	args: {
		label: 'Primary Input',
		disabled: false,
		leftIcon: Add16,
		size: InputTextSize.M,
		rightIcon: Add16,
	},
};
