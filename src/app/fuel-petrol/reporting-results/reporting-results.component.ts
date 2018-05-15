import {Component, Input, OnInit} from '@angular/core';
import {BaseControl} from '../../dynamic-forms/controls/base-control';
import {GroupControl} from '../../dynamic-forms/controls/group-controll';
import {ValidatorFn} from '@angular/forms';

import {ReportingResultType} from './reporting-result-type';
import {Column} from '../../fuel-settings';
import {PetrolFormValidators} from '../petrol-form-validators';
import {ConfigService} from '../../config.service';

@Component({
    selector: 'reporting-results',
    templateUrl: './reporting-results.component.html',
    styleUrls: ['./reporting-results.component.css']
})
export class ReportingResultsComponent implements OnInit {

    @Input() reportResultTypes: ReportingResultType[];

    @Input() controls: BaseControl<string>[];

    @Input() group: any;

    @Input() value: any;

    @Input() cols: Column[];

    rows: any[];

    years: any[];

    petrolFormValidator: PetrolFormValidators;

    groupValidators: ValidatorFn[] = [];

    displayDialog: boolean;

    selectedReportingResult: string;

    selectedReportingResultHeader: string;

    constructor(private configService: ConfigService) {

        this.years = [{'year': '2005'},
            {'year': '2006'},
            {'year': '2007'},
            {'year': '2008'},
            {'year': '2009'}];
    }

    ngOnInit() {
        this.petrolFormValidator = new PetrolFormValidators(this.configService);
        this.mapRowData();
    }

    /**
     * The value of rows the table is coming in the form of an object whereas the table expects an array of objects to render the rows.
     * For this we need to transform the object to an array and furthermore to add a row in the table
     * if no value exists in the original value object. So we start with the rows that we need to render
     * which are the report result types and for each one we create a row object containing the values (if available)
     * or an empty string if not.
     */
    private mapRowData() {
        this.rows = [];
        this.reportResultTypes.map(type => {
            // we need the report type field name on selection
            const row = {field: type.field};
            this.cols.forEach(col => {
                switch (col.field) {
                    case 'date': {
                        if (this.value[type.field] && this.value[type.field][col.field]) {
                            row[col.field] = this.value[type.field][col.field].year;
                        }
                        break;
                    }
                    case 'parameter': {
                        row[col.field] = type.header;
                        break;
                    }
                    default: {
                        if (this.value[type.field]) {
                            row[col.field] = this.value[type.field][col.field];
                        } else {
                            row[col.field] = '';
                        }
                        break;
                    }
                }
            });
            this.rows.push(row);
        });
    }

    filteredControls(key) {
        const petrolControls = (this.controls.filter(control => control.key === key)[0] as GroupControl);
        this.groupValidators = petrolControls.groupValidators;
        return petrolControls.groupControls;
    }

    openReportingResultDialog($event) {
        this.displayDialog = true;
        this.selectedReportingResult = $event.data.field;
        this.selectedReportingResultHeader = $event.data.parameter;
    }

    save(selectedReportingResult: string) {
        if (this.group.get(selectedReportingResult).valid) {
            this.displayDialog = false;
            // NOTE: The raw value is ABSOLUTELY required here, to retrieve values of disabled fields too!!!
            this.value = this.group.getRawValue();
            this.mapRowData();
        }
    }

    close() {
        this.displayDialog = false;
    }


}
