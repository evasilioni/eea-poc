import { AbstractControl, FormArray } from '@angular/forms';
import { ConfigService } from '../services/config.service';

export class PetrolFormValidators {

    private reportResultTypes: any[];

    constructor(private configService: ConfigService) {
        this.getReportResultTypes();
    }

    private getReportResultTypes(): void {
        if (this.configService != null) {
            this.configService.getPetrolSettings()
                .subscribe((data: any[]) => {
                    this.reportResultTypes = data['reportResultTypes'];
                });
        }

    }

    uniqueCountry() {
        return (control: AbstractControl): {} => {
            const errors = {};

            if (control.parent) {
                const parentFromArray = control.parent as FormArray;

                parentFromArray.controls
                    .filter(c => c !== control)
                    .forEach(c => {

                        if (c.get('country').value.toLowerCase() === control.get('country').value.toLowerCase()) {
                            Object.assign(errors, {
                                'Field \'Country\'': 'Country should be unique.'
                            });
                        }
                    });
            }


            return errors ? errors : null;
        };
    }

    periodValidation() {
        return (control: AbstractControl): { [key: string]: any } => {
            const period = control.get('period');
            const summerPeriodNorA = control.get('summerPeriodNorA');

            // tslint:disable-next-line:radix
            return period.value === 'Summer' &&  summerPeriodNorA.value === 'A' ?
            { '\'Period\' Field': 'Period should be Winter or Summer period should be N' } : null;
        };
    }

    minMaxValidation() {
        return (control: AbstractControl): { [key: string]: any } => {
            const minValue = control.get('min');
            const maxValue = control.get('max');

            // tslint:disable-next-line:radix
            return parseInt(minValue.value) > parseInt(maxValue.value) ? { '\'Min\' Field': 'Min cannot be greater than max' } : null;
        };
    }

    numOfSampleFrequencyValidation() {
        return (control: AbstractControl): {} => {
            const errors = {};

            if (control.get('sampleFrequency')) {
                const fieldTotal = control.get('sampleFrequency');


                if (this.reportResultTypes !== undefined && fieldTotal != null) {
                    this.reportResultTypes.forEach(r => {

                        let invalidNumber = false;
                        const fieldNumOfSamples = control.get(r.field).get('numOfSamples');
                        invalidNumber = (fieldTotal.value !== undefined) && (fieldNumOfSamples.value !== undefined) &&
                            (fieldTotal.value !== null) && (fieldNumOfSamples.value !== null) &&
                            // tslint:disable-next-line:radix
                            (parseInt(fieldNumOfSamples.value) > parseInt(fieldTotal.value.totalMonthValue));

                        if (invalidNumber) {
                            Object.assign(errors, {
                                [r.header]: 'Field \'Number of samples\' should be less than.... '
                            });
                        }
                    });
                }
            }


            return errors ? errors : null;
        };
    }
}
