import { AbstractControl, FormControl } from "@angular/forms";

export const noWhitespaceValidator = (control: FormControl | AbstractControl) => {
  const isSpace = (control.value || '').match(/\s/g);
  return isSpace ? { 'whitespace': true } : null;
}
export const emailPatternValidator = (control: FormControl | AbstractControl) => {
  const isSpace = !(control.value || '').match(/\S+@\w+\.\w+/g);
  return isSpace ? { 'emailPattern': true } : null;
}
