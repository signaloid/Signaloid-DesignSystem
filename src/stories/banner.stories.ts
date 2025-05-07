import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BannerComponent } from '../lib/components/static/banner/banner.component';
import { ButtonComponent } from '../lib/components/button/button.component';

export default {
	title: 'Components/Banner',
	component: BannerComponent,
	// Because the Banner is standalone, we include it in moduleMetadata imports
	decorators: [
		moduleMetadata({
			imports: [BannerComponent, ButtonComponent],
		}),
	],
	argTypes: {
		buttonLabel: {
			control: 'text',
			description: 'Label for the button',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables the button if true',
		},
	},
} as Meta<BannerComponent>;

type Story = StoryObj<BannerComponent>;

export const Default: Story = {
	args: {
		buttonLabel: 'Learn More',
		disabled: false,
	},
	render: (args) => ({
		props: args,
		template: `
      <lib-banner
        [buttonLabel]="buttonLabel"
        [disabled]="disabled"
      >
        <!-- Project the Title -->
        <div banner-title>Welcome!</div>

        <!-- Project the Description -->
        <div banner-description>
          Let’s setup your SCDP profile. Click the button below to complete your profile information.
        </div>



      </lib-banner>
    `,
	}),
};
