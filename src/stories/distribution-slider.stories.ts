import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { DistributionSliderComponent } from "../lib/components/distribution-slider/distribution-slider.component";
import { DecimalPipe } from "@angular/common";

export default {
	title: "Components/Distribution slider/DistributionSlider",
	component: DistributionSliderComponent,
	decorators: [
		moduleMetadata({
			// Since your component is standalone and already declares its own imports,
			// you can list it here. We also provide DecimalPipe since your component uses it.
			imports: [DistributionSliderComponent],
			providers: [DecimalPipe],
		}),
	],
	argTypes: {
		// Configure output events as actions to log interactions in Storybook's Actions panel
		distributionChange: { action: "distributionChange" },
		valueChange: { action: "valueChange" },
		collapse: { action: "collapse" },
	},
	args: {
		min: 0,
		max: 100,
		step: 1,
		initialValue: 9,
		initialDistribution: [
			[3, 50],
			[6, 50],
			[9, 50],
			[12, 50],
			[15, 50],
		],
		gridSteps: 18,
		graphHeight: 300,
		canCollapse: true,
		collapsed: false,
		xAxisLabel: "Time",
	},
} as Meta<DistributionSliderComponent>;

export const Default: StoryObj<DistributionSliderComponent> = {
	args: {
		step: 3,
	},
};
