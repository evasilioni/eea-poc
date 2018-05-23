import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';
import {DynamicFormService} from './dynamic-form.service';
import {BaseControl, ControlType} from '../controls/base-control';
import {debounceTime} from 'rxjs/operators/debounceTime';
import {ValidationService} from '../validation/validation.service';
import {RelationService} from '../relation/relation.service';
import {FormError, ValidationErrorMessage} from '../validation/form-error';

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

    // only way to use enum in angular template...
    // https://stackoverflow.com/questions/42464367/angular2-use-enum-value-in-html-value-attribute/
    ControlType = ControlType;

    /**
     * List of controls to render in the form
     * @type {any[]}
     */
    @Input() controls: BaseControl<any>[] = [];

    /**
     * List of controls to add in form but not render
     * @type {any[]}
     */
    @Input() customControls: BaseControl<any>[] = [];

    // TODO maybe it would be better if we handled group validators the same way as field ones.
    /**
     * Validators to add on the level of the FormGroup
     * @type {any[]}
     */
    @Input() groupValidators: ValidatorFn[] = [];

    /**
     * FormControl that this nested FormGroup should be added on
     */
    @Input() parent: AbstractControl;

    /**
     * Name used as the control name when adding the form to its parent
     */
    @Input() formName: string;

    /**
     * This will recursively iterate through all child form groups to retrieve all validation errors
     */
    @Input() showNestedFormGroupErrors: boolean;

    /**
     * If false the validation errors of this form group will not be shown
     */
    @Input() showErrors: boolean;

    @Input() value: any;

    /**
     * How many controls should be grouped per grid row
     */
    @Input() controlsPerRow: number;

    /**
     * TODO: not yet used
     * @type {EventEmitter<FormGroup>}
     */
    @Output() formSubmit = new EventEmitter<FormGroup>();

    /**
     * Emmited when the current form control is created
     * @type {EventEmitter<FormGroup>}
     */
    @Output() formCreated = new EventEmitter<FormGroup>();

    @Input() form: FormGroup;

    formErrors: FormError[] = [];

    validationMessages: ValidationErrorMessage[] = [];

    disabledControls: AbstractControl[] = [];

    groupedControls: BaseControl<string>[][];

    constructor(private dynamicFormService: DynamicFormService,
                private cdRef: ChangeDetectorRef,
                private validationService: ValidationService,
                private relationService: RelationService) {

        if (this.controlsPerRow === undefined) {
            this.controlsPerRow = 1;
        }
    }

    ngOnInit() {
        this.groupedControls = this.dynamicFormService.groupControls(this.controls, this.controlsPerRow);
        if (!this.form) {

            this.form = this.dynamicFormService.toFormGroup(this.controls, this.customControls,
                this.groupValidators, this.formName, this.parent);
            this.formCreated.emit(this.form);
        }

        this.initValidation();
        this.form.valueChanges
            .pipe(debounceTime(300))
            .subscribe(data => this.onValueChanged(data));

        if (this.value) {
            this.bindDataToForm(this.value);
        }

        this.onValueChanged(); // (re)set validation messages
    }


    private initValidation() {
        this.controls
            .forEach((control) => {
                this.formErrors.push({
                    controlKey: control.key,
                    errors: this.validationService.generateFormErrorStructure(control)
                });
                this.validationMessages.push({
                    controlKey: control.key,
                    validationTuple: this.validationService.generateValidationMessages(control)
                });
            });
    }

    onSubmit() {
        this.formSubmit.emit(this.form);
    }

    onValueChanged(data?: any) {
        if (!this.form) {
            return;
        }
        this.formErrors = this.validationService.updateFormErrors(this.form, this.formErrors, this.validationMessages);
        this.disabledControls = this.relationService.handleRelations(this.form, this.controls, this.disabledControls);
    }

    getControlErrors(key: string) {
        return this.formErrors.find(error => error.controlKey === key);
    }


    bindDataToForm(value: any) {
        this.form.patchValue(value);
    }
}
