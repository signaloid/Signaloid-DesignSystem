// password‐strength.component.ts
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormControl,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import Checkmarkoutline from '@carbon/icons/es/checkmark--outline/32';
import CheckmarkFilled from '@carbon/icons/es/checkmark--filled/32';
import { CarbonIconComponent } from '../icon/icon.component';
interface RegexRule {
  label: string;
  pattern: RegExp;
}

@Component({
  selector: 'lib-password-strength',
  templateUrl: './password-strength.component.html',
  imports: [CarbonIconComponent],
  styleUrls: ['./password-strength.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() password: string = '';
  @Input() validators: ValidatorFn[] = [];
  @Input() validationMessages: { [errorKey: string]: string } = {};
  @Input() regexRules: RegexRule[] = [];
  private internalControl: FormControl = new FormControl('');

  ngOnChanges(changes: SimpleChanges): void {
    // If the parent changed which validators it wants, re‐set them on our internal control:
    if (changes['validators']) {
      this.internalControl.setValidators(this.validators);
      // (Re‐validate in case `password` was already set)
      this.internalControl.updateValueAndValidity({ emitEvent: false });
    }

    // If the parent changed the password string, push it into our internal control:
    if (changes['password']) {
      this.internalControl.setValue(this.password, { emitEvent: false });
      this.internalControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  /**
   * Build a list of “errorKeys” from our validationMessages map,
   * then check for each one: does control.hasError(key)?
   * If it does, rule is NOT satisfied; if it does NOT, rule is satisfied.
   */
  get validatorRuleStatus(): Array<{ key: string; label: string; valid: boolean }> {
    const errs: ValidationErrors | null = this.internalControl.errors;

    return Object.keys(this.validationMessages).map((key) => {
      return {
        key,
        label: this.validationMessages[key],
        valid: !(errs && errs[key] !== undefined),
      };
    });
  }

  /**
   * Separately, for each regexRules[i], we test pattern.test(password).
   */
  get regexRuleStatus(): Array<{ label: string; valid: boolean }> {
    if (!this.password || this.password.length === 0) {
      return this.regexRules.map((rule) => ({
        label: rule.label,
        valid: false,
      }));
    }

    return this.regexRules.map((rule) => ({
      label: rule.label,
      valid: rule.pattern.test(this.password),
    }));
  }

  get allRules(): Array<{ label: string; valid: boolean }> {
    const fromValidators = this.validatorRuleStatus.map((r) => ({
      label: r.label,
      valid: r.valid,
    }));
    const fromRegex = this.regexRuleStatus.map((r) => ({
      label: r.label,
      valid: r.valid,
    }));
    return [...fromValidators, ...fromRegex];
  }


  get totalRulesCount(): number {
    return Object.keys(this.validationMessages).length + this.regexRules.length;
  }

  get passedRulesCount(): number {
    return this.allRules.filter((r) => r.valid).length;
  }
  get filledBarCount(): number {
    const nPassed = this.passedRulesCount;
    const total = this.totalRulesCount;
    if (total === 0) {
      return 0;
    }
    // Scale up to 5 bars (Math.round ensures 0→0, total→5, and in between is proportionate).
    return Math.round((nPassed / total) * 5);
  }


  get strengthLabel(): string {
    const n = this.passedRulesCount;
    const total = this.totalRulesCount;

    if (total === 0) {
      return '';
    }
    const ratio = n / total;
    if (ratio === 0) return 'Too Weak';
    if (ratio < 0.5) return 'Weak';
    if (ratio < 1) return 'Medium';
    return 'Strong';
  }

  protected readonly CheckmarkFilled = CheckmarkFilled;
  protected readonly Checkmarkoutline = Checkmarkoutline;
}
