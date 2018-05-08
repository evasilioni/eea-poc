import {Component, Input, OnInit} from '@angular/core';
import {BaseControl} from '../../dynamic-forms/controls/base-control';
import {GroupControl} from '../../dynamic-forms/controls/group-controll';
import {ValidatorFn} from '@angular/forms';
import {PetrolFormValidators} from '../../validators/petrol-form-validators';
import {ConfigService} from '../../services/config.service';

@Component({
    selector: 'reporting-results',
    templateUrl: './reporting-results.component.html',
    styleUrls: ['./reporting-results.component.css']
})
export class ReportingResultsComponent implements OnInit {

    @Input() reportResultTypes: any[];

    @Input() controls: BaseControl<string>[];

    @Input() group: any;

    @Input() value: any;

    @Input() cols: any;

    years: any[];
    petrolFormValidator: PetrolFormValidators;

    groupValidators: ValidatorFn[] = [];

    private filteredYears = {value: []};

    rows: any;

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
        console.log('columns rrc', this.cols ? this.cols : '');
        console.log('value rrc', this.value ? this.value : '');
        this.petrolFormValidator = new PetrolFormValidators(this.configService);
        // primeng table requires an array for the value but we have an object. so we need to get the keys as a value
        // and by the way remove the irrelevant keys
        this.rows = Object.keys(this.value).filter(key => key !== 'id' && key !== 'basicPetrolInfo' && key !== 'sampleFrequency');
    }

    filteredControls(key) {
        const petrolControls = (this.controls.filter(control => control.key === key)[0] as GroupControl);
        this.groupValidators = petrolControls.groupValidators;
        return petrolControls.groupControls;
    }

    openReportingResultDialog($event) {
        this.displayDialog = true;
        this.selectedReportingResult = $event.data;
        this.selectedReportingResultHeader = this.reportResultTypes.find(r => r.field === this.selectedReportingResult).header;
    }

    save() {
        if (this.group.valid) {
            this.displayDialog = false;
            this.value = this.group.value;
        }
    }

    close() {
        this.displayDialog = false;
    }

}
