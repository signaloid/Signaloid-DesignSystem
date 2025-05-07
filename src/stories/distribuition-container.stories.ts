// distribution-plot-container.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';
import { DistributionPlotContainerComponent } from '../lib/components/distribution-plot-container/distribution-plot-container.component';

// Define the metadata for this component
const meta: Meta<DistributionPlotContainerComponent> = {
	title: 'Components/Distribution slider/Distribution Plot Container',
	component: DistributionPlotContainerComponent,
	render: (args) => ({
		props: {
			...args,
			distributionChange: (event: { distribution: [number, number][]; value: number }) => {},
		},
	}),
	argTypes: {
		min: { control: 'number' },
		max: { control: 'number' },
		step: { control: 'number' },
		initialValue: { control: 'number' },
		gridSteps: { control: 'number' },
		graphHeight: { control: 'number' },
		canCollapse: { control: 'boolean' },
		collapsed: { control: 'boolean' },
		title: { control: 'text' },
		xAxisLabel: { control: 'text' },
		yAxisLabel: { control: 'text' },
	},
};

export default meta;
type Story = StoryObj<DistributionPlotContainerComponent>;

export const WithTooltip: Story = {
	args: {
		title: 'Distribution Plot',
		min: 0,
		max: 100,
		step: 5,
		initialValue: 50,
		initialDistribution: [
			[0, 0],
			[25, 25],
			[50, 100],
			[75, 25],
			[100, 0],
		],
		gridSteps: 10,
		graphHeight: 200,
		canCollapse: true,
		collapsed: false,
		xAxisLabel: '',
		yAxisLabel: '',
	},
	render: (args) => ({
		props: args,
		template: `
    <div style="height: 200px"></div>
      <lib-distribution-plot-container
        [title]="title"
        [min]="min"
        [max]="max"
        [step]="step"
        [initialValue]="initialValue"
        [initialDistribution]="initialDistribution"
        [gridSteps]="gridSteps"
        [graphHeight]="graphHeight"
        [canCollapse]="canCollapse"
        [collapsed]="collapsed"
        [xAxisLabel]="xAxisLabel"
        [yAxisLabel]="yAxisLabel"
        (distributionChange)="distributionChange($event)"
      >
            <p tooltip-title>Slider Widget to define the distribution</p>
            <div tooltip-body>
                Signaloid provides an intuitive way to define the shape of the distribution for a variable. On the x-axis you can define the possible values that the variable can take. On the y-axis you can define the probability that the variable will take that value. You can slide the distribution left or right and it's shape will remain intact.
            </div>
        <div plot-description>

        Move slider and the dirac deltas to shape the distribution of the Temperature. This information will pass on to the application which will use it in the calculations. You can modify this slider and re-launch tasks to observe how it affects the output values.
        </div>
        <div bottom-title>Temperature (ADC Reading) </div>
      </lib-distribution-plot-container>
    `,
	}),
};
