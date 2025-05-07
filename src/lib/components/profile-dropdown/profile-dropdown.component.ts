import { Component, Input, OnInit } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CarbonIconComponent } from '../icon/icon.component';
import { UpperCasePipe } from '@angular/common';
import { ProfileDropdownItem } from './profile.dropdown.models';
import { MatDivider } from '@angular/material/divider';
//@ts-ignore
import { ChevronUp } from '@carbon/icons/lib/chevron--up/32.js';
//@ts-ignore
import { ChevronDown } from '@carbon/icons/lib/chevron--down/32.js';
//@ts-ignore
import { UserAvatar } from '@carbon/icons/lib/user--avatar/16.js';

@Component({
	selector: 'lib-profile-dropdown',
	imports: [MatMenuTrigger, MatMenu, CarbonIconComponent, UpperCasePipe, MatMenuItem, MatDivider],
	templateUrl: './profile-dropdown.component.html',
	styleUrl: './profile-dropdown.component.css',
})
export class ProfileDropdownComponent implements OnInit {
	@Input() username: string = '';
	@Input() userTier: string = '';
	@Input() menuItems: ProfileDropdownItem[] = [];

	arrowUpIcon = ChevronUp;
	arrowDownIcon = ChevronDown;
	constructor() {}
	ngOnInit() {}

	public getUsernameInitials(username: string) {
		return username
			.split(' ')
			.map((n) => n[0])
			.join('');
	}

	protected readonly UserAvatar = UserAvatar;
}
