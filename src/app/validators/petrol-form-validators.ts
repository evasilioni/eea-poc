import { AbstractControl, Validators, ValidatorFn, FormGroup, FormArray } from '@angular/forms';
import { ConfigService } from '../services/config.service';

export class PetrolFormValidators {

  private reportResultTypes: any[];

  constructor(private configService: ConfigService) {
    this.getReportResultTypes();
  }

  private getReportResultTypes(): void {
    this.configService.getPetrolSettings()
      .subscribe((data: any[]) => {
        this.reportResultTypes = data["reportResultTypes"]
      })
  }

  uniqueCountry() {
    return (control: AbstractControl): {} => {
      var errors = {};

      if (control.parent) {
        let parentFromArray = control.parent as FormArray;

        let persistedPetrol = parentFromArray.controls.find(c => c.get('id').value === control.get('id').value);
        let transientCountry = persistedPetrol.get('country').value;

        parentFromArray.controls
          .filter(c => c.get('id').value !== persistedPetrol.get('id').value)
          .forEach(c => {

            if (c.get('country').value.toLowerCase() === transientCountry.toLowerCase()) {
              Object.assign(errors,  {
                  'invalidCountry': true
              });
            }
          });
      }


      return errors ? errors : null;
    }
  }

  minMaxValidation() {
    return (control: AbstractControl): { [key: string]: any } => {
      let minValue = control.get('min');
      let maxValue = control.get('max');

      return parseInt(minValue.value) > parseInt(maxValue.value) ? { 'invalidNumberMin': true } : null;
    };
  }

  formGroupValidationFunction() {
    return (control: AbstractControl): {} => {
      let fieldTotal = control.get('sampleFrequency').get('value');
      var errors = {};

      if (this.reportResultTypes !== undefined) {
        this.reportResultTypes.forEach(r => {

          let invalidNumber = false;
          let fieldNumOfSamples = control.get(r.field).get('numOfSamples');
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
    }
  }
}
