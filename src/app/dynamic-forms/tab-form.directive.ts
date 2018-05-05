import {Directive, HostBinding, Input} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {SuperForm} from 'angular-super-validator';
import {TabPanel} from 'primeng/primeng';

@Directive({
    selector: '[tabForm]'
})
export class TabFormDirective {

    @Input() tabForm: FormGroup[];

    constructor(private tabPanel: TabPanel) {
    }

    @HostBinding('class')
    private get headerStyleClass() {
        this.tabPanel.headerStyleClass = this.haveErrors(this.tabForm);
        return '';
    }

    haveErrors(forms: FormGroup[]): string {
        if (!forms) {
            return '';
        }
        return forms.some(form => this.hasErrors(form)) ? 'tab-error' : '';
    }

    private hasErrors(form: FormGroup): boolean {
        if (form && !form.valid && form.touched && form.dirty) {
            if (this.hasGroupErrors(form)) {
                console.log('error found', this.tabForm);
                return true;
            }
            const errors = SuperForm.getAllErrorsFlat(form);
            return Object.keys(errors).length > 0;
        }
        return false;

    }

    private hasGroupErrors(form: FormGroup) {
        if (form.errors) {
            return true;
        } else {
            Object.keys(form.controls).forEach(c => {
                const control = form.get(c);
                if (control.errors) {
                    return true;
                }
                if (control instanceof FormGroup) {
                    return this.hasGroupErrors(control);
                } else if (control instanceof FormArray) {
                    control.controls.forEach(fac => {
                        if (fac instanceof FormGroup) {
                            return this.hasGroupErrors(fac);
                        } else if (control.errors) {
                            return true;
                        }
                    });
                }
            });
        }
        return false;
    }

}
