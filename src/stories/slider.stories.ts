import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { SliderComponent } from '../lib/components/slider/slider.component';
import { MatSlider, MatSliderRangeThumb, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { SliderTypes } from '../lib/components/slider/slider.types';

const meta: Meta<SliderComponent> = {
	title: 'Components/Inputs/Slider',
	component: SliderComponent,
	decorators: [
		moduleMetadata({
			imports: [MatSlider, MatSliderThumb, MatSliderRangeThumb, FormsModule],
		}),
	],
	argTypes: {
		type: { control: false },
		multiple: { control: 'boolean' },
		disabled: { control: 'boolean' },
		multipleMinValue: { control: 'number' },
		multipleMaxValue: { control: 'number' },
	},
};

type Story = StoryObj<SliderComponent>;

export const Flat: Story = {
	args: {
		type: SliderTypes.FLAT,
		value: 50,
		min: 0,
		max: 100,
	},
};

export const Numeric: Story = {
	args: {
		type: SliderTypes.NUMERIC,
		value: 50,
		min: 0,
		max: 100,
	},
};

export const Tooltip: Story = {
	args: {
		type: SliderTypes.TOOLTIP,
		value: 50,
		min: 0,
		max: 100,
	},
};
export default meta;
