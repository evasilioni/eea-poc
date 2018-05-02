import { Component, Input, OnInit } from '@angular/core';
import { BaseControl } from '../../dynamic-forms/controls/base-control';
import { GroupControl } from '../../dynamic-forms/controls/group-controll';
import { TextboxControl } from '../../dynamic-forms/controls/textbox-control';
import { CalendarControl } from '../../dynamic-forms/controls/calendar-control';
import { AutoComplete } from 'primeng/primeng';
import { AutocompleteControl } from '../../dynamic-forms/controls/autocomplete-control';
import { Validators, ValidatorFn } from '@angular/forms';
import { PetrolFormValidators } from '../../validators/petrol-form-validators';
import { ConfigService } from '../../services/config.service';

@Component({
    selector: 'reporting-results',
    templateUrl: './reporting-results.component.html',
    styleUrls: ['./reporting-results.component.css']
})
export class ReportingResultsComponent implements OnInit {

    years: any[];
    petrolFormValidator: PetrolFormValidators;

    @Input() reportResultTypes: any[];

    controls: BaseControl<string>[];
    groupValidators: ValidatorFn[] = [];

    @Input() group: any;

    @Input() value: any;

    private filteredYears = {value: []};

    constructor(private configService: ConfigService) {
        this.years = [{'year': '2005'},
        {'year': '2006'},
        {'year': '2007'},
        {'year': '2008'},
        {'year': '2009'}];
    }

    ngOnInit() {
        this.petrolFormValidator = new PetrolFormValidators(this.configService);
        this.controls = this.getControls();
    }

    getControls(): BaseControl<string>[] {
        return [
            new GroupControl({
                key: 'researchOctaneNumber',
                groupControls: this.getReportResultGroup(),
                groupValidators: [this.petrolFormValidator.minMaxValidation()]
            }),
            new GroupControl({
                key: 'motorOctaneNumber',
                groupControls: this.getReportResultGroup(),
                groupValidators: [this.petrolFormValidator.minMaxValidation()]
            }),
            new GroupControl({
                key: 'vapourPressure',
                groupControls: this.getReportResultGroup()
            }),
            new GroupControl({
                key: 'distillationEvaporated100',
                groupControls: this.getReportResultGroup()
            }),
            new GroupControl({
                key: 'distillationEvaporated150',
                groupControls: this.getReportResultGroup()
            })
        ];
    }

    filteredControls(key) {
        const test = (this.controls.filter(control => control.key === key)[0] as GroupControl);
        this.groupValidators = test.groupValidators;
        return test.groupControls;
    }

    getReportResultGroup(): BaseControl<string>[] {
        return [
            new TextboxControl({key: 'unit',  label: 'Unit', disabled : () => true }),
            new TextboxControl({key: 'numOfSamples', label: 'Number Of Samples',
            validators: [
                {
                    formError: 'required',
                    validator: Validators.required,
                    validationMessage: 'num of samples'
                }]
            }),
            new TextboxControl({key: 'min', label: 'Min'}),
            new TextboxControl({key: 'max', label: 'Max'}),
            new TextboxControl({key: 'median', label: 'Median'}),
            new TextboxControl({key: 'standardDeviation', label: 'Standard Deviation'}),
            new TextboxControl({key: 'toleranceLimit', label: 'Tolerance Limit'}),
            new TextboxControl({key: 'sampleValue', label: 'Sample Value'}),
            new TextboxControl({key: 'nationalMin', label: 'National Min'}),
            new TextboxControl({key: 'nationalMax', label: 'National Max'}),
            new TextboxControl({key: 'directiveMin', label: 'Directive Min'}),
            new TextboxControl({key: 'directiveMax', label: 'Directive Max'}),
            new TextboxControl({key: 'method', label: 'Method'}),
            new AutocompleteControl({ key: 'date', label: 'Date',
                suggestions: this.filteredYears,
                searchFn: this.searchYears,
                suggestionField: 'year'
            })
        ];
    }


    searchYears = (event) => {
        return this.years
            .filter((y: any) => y.year.includes(event.query));
    }

}
