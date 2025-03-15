import { ValidatorFn, AbstractControl, ValidationErrors, FormControl } from "@angular/forms";

export const isNumber = (): ValidatorFn => {
    return (component: AbstractControl): ValidationErrors | null => {
        let control = component as FormControl;
        return !isNaN(control.value) ? null : { IngredientCountIsNotNumber: true };
    }
}