import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function safePassword(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);

    const hasLowerCase = /[a-z]+/.test(value);

    const hasNumeric = /\d+/.test(value);

    const length = value.length >= 6;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && length;

    return !passwordValid ? { safePassword: true } : null;
  }
};

export function isSameInConfirmPassword(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    const confirmPassword = control.value;

    if (!confirmPassword) {
      return null;
    }

    if (parent?.get('password')) {
      const passwordControl = parent.get('password');
      return (passwordControl?.value != confirmPassword) ? { passwordIsNotSame: true } : null;
    }

    return null;
  }
}

export function tiengVietKhongDau(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const re = /[^a-z\d]/

    return re.test(value) ? { containsSpecialCharacter: true } : null;
  }
}