import {Component, Input, OnInit} from '@angular/core';
import {BaseControl} from '../../dynamic-forms/controls/base-control';
import {GroupControl} from '../../dynamic-forms/controls/group-controll';
import {FormGroup, ValidatorFn} from '@angular/forms';

import {ReportingResultType} from './reporting-result-type';
import {Column} from '../../fuel-settings';
import {PetrolFormValidators} from '../petrol-form-validators';
import {ConfigService} from '../../config.service';
import * as Handsontable from 'handsontable';
import {ReportingResultsService} from './reporting-results.service';

@Component({
    selector: 'reporting-results',
    templateUrl: './reporting-results.component.html',
    styleUrls: ['./reporting-results.component.css']
})
export class ReportingResultsComponent implements OnInit {

    @Input() reportResultTypes: ReportingResultType[];

    @Input() controls: BaseControl<string>[];

    @Input() group: FormGroup;

    @Input() value: any;

    @Input() cols: Column[];

    rows: any[];

    years: any[];

    petrolFormValidator: PetrolFormValidators;

    groupValidators: ValidatorFn[] = [];

    displayDialog: boolean;

    selectedReportingResult: string;

    selectedReportingResultHeader: string;

    hotTableSettings: Handsontable.GridSettings;

    renderHot: boolean;

    rowsChanged: number[] = [];

    constructor(private configService: ConfigService, private reportingResultsService: ReportingResultsService) {

    }

    ngOnInit() {
        this.petrolFormValidator = new PetrolFormValidators(this.configService);

        this.rows = this.reportingResultsService.mapRows(this.reportResultTypes, this.cols, this.value);

        this.hotTableSettings = {
            colHeaders: this.cols.map(col => col.header),
            startCols: this.cols.length,
            data: this.rows,
            columns: this.cols.map(col => {
                    return {
                        data: col.field,
                        readOnly: col.readOnly
                    };
                }
            ),
            preventOverflow: 'horizontal'
        };

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

    save() {
        if (this.group.get(this.selectedReportingResult).valid) {
            this.displayDialog = false;
            this.value = this.group.getRawValue();
            const selectedRowIndex = this.rows.findIndex(row => row.field === this.selectedReportingResult);
            this.replaceRow(selectedRowIndex);
            // TODO refresh calculated fields
        }
    }

    close() {
        this.displayDialog = false;
    }


    toggleEditAllRows() {
        this.renderHot = !this.renderHot;
        if (!this.renderHot) {
            // assigning to value does not automatically update the FormGroup...
            const newValue = this.reportingResultsService.mapRowsToValue(this.rows);
            this.value = newValue;
            // ...patchValue must be also called if we want to immediately update the FormGroup
            this.group.patchValue(newValue);
            // finally, for every changed row we must manually mark dirty all fields of corresponding FormGroup
            this.markGroupControlsDirty();
        }
    }

    private markGroupControlsDirty() {
        const changedFormGroups = this.rowsChanged
            .map(rowIndex => this.rows[rowIndex].field)
            .map(field => this.group.get(field) as FormGroup);

        changedFormGroups.forEach(group => {
            Object.keys(group.controls)
                .forEach(key => group.get(key).markAsDirty());
        });
        this.rowsChanged = [];
    }

    /**
     * Adds each unique row to the rowsChanged array.
     *
     * $event.params[0] is an array and each of its entries is an array of which the first element is the changed row.
     *
     * @param $event
     */
    markRowChanged($event) {
        if ($event.params[0]) {
            $event.params[0].forEach(change => {
                const rowChanged = change[0];
                if (this.rowsChanged.findIndex(row => row === rowChanged) === -1) {
                    this.rowsChanged.push(rowChanged);
                }
            });
        }
    }

    /**
     * Replace row with new data form the form
     * @param {number} selectedRowIndex
     */
    private replaceRow(selectedRowIndex: number) {
        const selectedType = this.reportResultTypes.find(type => type.field === this.selectedReportingResult);
        this.rows.splice(selectedRowIndex, 1,
            this.reportingResultsService.mapRow(selectedType, this.cols, this.value));
    }

    getInvalidRowStyleClass(rowData: any) {
        return this.group.controls[rowData.field].invalid &&
                this.group.controls[rowData.field].dirty ? 'invalid-row' : null;
    }
}

