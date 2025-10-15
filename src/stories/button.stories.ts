// button.stories.ts
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../lib/components/button/button.component';
import { MatButtonModule } from '@angular/material/button';
import { CarbonIconComponent } from '../lib/components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonSize, ButtonSizes, ButtonType } from '../lib/components/button/button.types';
// Import an example icon for the leftIcon input.
// @ts-ignore
import Add16 from '@carbon/icons/es/watson-health/3D-curve--auto-vessels/20';

const meta: Meta<ButtonComponent> = {
	title: 'Components/Button',
	component: ButtonComponent,
	decorators: [
		moduleMetadata({
			imports: [MatButtonModule, BrowserAnimationsModule, ButtonComponent, CarbonIconComponent],
		}),
	],
	argTypes: {
		size: {
			control: 'select',
			options: Object.values(ButtonSize),
		},
		type: { control: false },
		label: { control: 'text' },
		disabled: { control: 'boolean' },
	},
	parameters: {
		docs: {
			description: {
				component: `
### Button Types:
- **Primary**: \`${ButtonType.Primary}\`
- **Secondary**: \`${ButtonType.Secondary}\`
- **Outlined**: \`${ButtonType.Outlined}\`
- **Destructive**: \`${ButtonType.Destructive}\`

### Button Sizes:
- **Small**: \`${JSON.stringify(ButtonSizes[ButtonSize.S])}\`
- **Medium**: \`${JSON.stringify(ButtonSizes[ButtonSize.M])}\`
- **Large**: \`${JSON.stringify(ButtonSizes[ButtonSize.L])}\`
- **X-Large**: \`${JSON.stringify(ButtonSizes[ButtonSize.XL])}\`
        `,
			},
		},
	},
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
	args: {
		label: 'Primary Button',
		size: ButtonSize.M,
		type: ButtonType.Primary,
		disabled: false,
	},
};

export const Secondary: Story = {
	args: {
		label: 'Secondary Button',
		size: ButtonSize.M,
		type: ButtonType.Secondary,
		disabled: false,
	},
};

export const Outlined: Story = {
	args: {
		label: 'Outlined Button',
		size: ButtonSize.M,
		type: ButtonType.Outlined,
		disabled: false,
	},
};

export const Destructive: Story = {
	args: {
		label: 'Destructive Button',
		size: ButtonSize.M,
		type: ButtonType.Destructive,
		disabled: false,
	},
};

export const WithLeftIcon: Story = {
	args: {
		label: 'Button with Icon',
		size: ButtonSize.M,
		type: ButtonType.Primary,
		leftIcon: Add16,
	},
};

export const WithBothIcons: Story = {
	args: {
		label: 'Button with two Icons',
		size: ButtonSize.M,
		type: ButtonType.Primary,
		leftIcon: Add16,
		rightIcon: Add16,
	},
};

export const Disabled: Story = {
	args: {
		label: 'Disabled Button',
		size: ButtonSize.M,
		type: ButtonType.Primary,
		disabled: true,
	},
};
