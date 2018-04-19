import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { ConfigService } from '../services/config.service';

export class PetrolFormValidators {
    
  reportResultTypes: any[];

  constructor(private configService: ConfigService) {
    this.getReportResultTypes();
  }

  getReportResultTypes(): void {
    this.configService.getPetrolSettings()
      .subscribe((data: any[]) => {
        this.reportResultTypes = data["reportResultTypes"]
      })
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
          invalidNumber = (parseInt(fieldNumOfSamples.value) > parseInt(fieldTotal.value)) &&
            (fieldTotal.value !== undefined) && (fieldNumOfSamples.value !== undefined);

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
