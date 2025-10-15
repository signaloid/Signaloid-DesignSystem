// profile-dropdown.stories.ts
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

// Import Carbon icons correctly
// @ts-ignore
import { UserAvatar } from '@carbon/icons/lib/user--avatar/32.js';
// @ts-ignore
import { Settings } from '@carbon/icons/lib/settings/32.js';
// @ts-ignore
import { Help } from '@carbon/icons/lib/help/32.js';
// @ts-ignore
import { Logout } from '@carbon/icons/lib/logout/32.js';
import { ProfileDropdownComponent } from '../lib/components';
import { ThemeService } from '../lib/services';

// Define metadata for the component
const meta: Meta<ProfileDropdownComponent> = {
	title: 'Components/Profile Dropdown',
	component: ProfileDropdownComponent,
	decorators: [
		moduleMetadata({
			providers: [ThemeService],
		}),
	],
	tags: ['autodocs'],

	// Include necessary Angular Material modules
	render: (args: ProfileDropdownComponent) => {
		return {
			props: args,
		};
	},
	argTypes: {
		username: { control: 'text' },
		userTier: { control: 'text' },
		menuItems: { control: 'object' },
	},
};

export default meta;
type Story = StoryObj<ProfileDropdownComponent>;

// Define the default state of the component
export const Default: Story = {
	args: {
		username: 'John Doe',
		userTier: 'Premium Member',
		menuItems: [
			{
				label: 'My Profile',
				link: '/profile',
				icon: UserAvatar,
				isDivider: false,
			},
			{
				label: 'Settings',
				link: '/settings',
				icon: Settings,
				isDivider: false,
			},
			{
				isDivider: true,
			},
			{
				label: 'Help',
				link: '/help',
				icon: Help,
				isDivider: false,
			},
			{
				label: 'Logout',
				link: '/logout',
				icon: Logout,
				isDivider: false,
			},
		],
	},
};

// Story for a user with a long name
export const LongUsername: Story = {
	args: {
		...Default.args,
		username: 'Alexander Bartholomew Winchester-Hughes',
	},
};

// Story for a different user tier
export const BasicUser: Story = {
	args: {
		...Default.args,
		userTier: 'Basic User',
	},
};

// Story for a minimal menu
export const MinimalMenu: Story = {
	args: {
		...Default.args,
		menuItems: [
			{
				label: 'My Profile',
				link: '/profile',
				icon: UserAvatar,
				isDivider: false,
			},
			{
				label: 'Logout',
				link: '/logout',
				icon: Logout,
				isDivider: false,
			},
		],
	},
};
