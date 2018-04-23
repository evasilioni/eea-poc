import {AbstractControl, FormArray} from '@angular/forms';
import {ConfigService} from '../services/config.service';

export class PetrolFormValidators {

    private reportResultTypes: any[];

    constructor(private configService: ConfigService) {
        this.getReportResultTypes();
    }

    private getReportResultTypes(): void {
        this.configService.getPetrolSettings()
            .subscribe((data: any[]) => {
                this.reportResultTypes = data['reportResultTypes'];
            });
    }

    uniqueCountry() {
        return (control: AbstractControl): {} => {
            const errors = {};

            if (control.parent) {
                const parentFromArray = control.parent as FormArray;

                const persistedPetrol = parentFromArray.controls.find(c => c.get('id').value === control.get('id').value);
                const transientCountry = persistedPetrol.get('country').value;

                parentFromArray.controls
                    .filter(c => c.get('id').value !== persistedPetrol.get('id').value)
                    .forEach(c => {

                        if (c.get('country').value.toLowerCase() === transientCountry.toLowerCase()) {
                            Object.assign(errors, {
                                'invalidCountry': true
                            });
                        }
                    });
            }


            return errors ? errors : null;
        };
    }

    minMaxValidation() {
        return (control: AbstractControl): { [key: string]: any } => {
            const minValue = control.get('min');
            const maxValue = control.get('max');

            return parseInt(minValue.value) > parseInt(maxValue.value) ? {'invalidNumberMin': true} : null;
        };
    }

    formGroupValidationFunction() {
        return (control: AbstractControl): {} => {
            const fieldTotal = control.get('sampleFrequency').get('value');
            const errors = {};

            if (this.reportResultTypes !== undefined) {
                this.reportResultTypes.forEach(r => {

                    let invalidNumber = false;
                    const fieldNumOfSamples = control.get(r.field).get('numOfSamples');
                    invalidNumber = (fieldTotal.value !== undefined) && (fieldNumOfSamples.value !== undefined) &&
                        (fieldTotal.value !== null) && (fieldNumOfSamples.value !== null) &&
                        (parseInt(fieldNumOfSamples.value) > parseInt(fieldTotal.value));

                    if (invalidNumber) {
                        Object.assign(errors, {
                            [r.field]: {
                                'invalidNumberofSample': true
                            }
                        });
                    }
                });
            }

            return errors ? errors : null;
        };
    }
}
