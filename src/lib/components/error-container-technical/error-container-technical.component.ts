import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Location } from '@angular/common';
@Component({
	selector: 'lib-error-container-technical',
	imports: [ButtonComponent],
	templateUrl: './error-container-technical.component.html',
	styleUrl: './error-container-technical.component.css',
})
export class ErrorContainerTechnicalComponent {
  @Output() onClickEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() showButton: boolean = true;
  constructor(private _location: Location){}

  onClick() {
    this._location.back();
  }

}
