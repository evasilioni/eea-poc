import {ValidatorFn} from '@angular/forms';

export interface ValidatorConfig {
    formError: string;
    validator: ValidatorFn;
    validationMessage?: string;
}
