import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {GroupControl} from '../../dynamic-forms/controls/group-controll';
import {ArrayControl} from '../../dynamic-forms/controls/array-control';

@Component({
    selector: 'fuel-petrol-tab',
    templateUrl: './fuel-petrol-tab.component.html',
    styleUrls: ['./fuel-petrol-tab.component.css']
})
export class FuelPetrolTabComponent implements OnInit {

    @Input() petrolGroupControl: GroupControl;
    @Input() petrolFormGroup: FormGroup;
    @Input() value;
    @Input() reportResultTypes;
    @Input() columns;

    constructor() {

    }

    ngOnInit() {

    }

    getBasicPetrolInfoControls() {
        const basicPetrolInfoGroupControl = this.petrolGroupControl.groupControls
            .find(control => control.key === 'basicPetrolInfo') as GroupControl;
        return basicPetrolInfoGroupControl.groupControls;
    }

    getBasicPetrolInfoFormGroup() {
        return this.petrolFormGroup.get('basicPetrolInfo');
    }

    getBasicPetrolInfoValue() {
        return this.value['basicPetrolInfo'];
    }

    getReportingResultsControls() {
       return this.petrolGroupControl.groupControls;
    }

    getSamplingFrequencyControls() {
        const sampleFrequencyGroupControl = this.petrolGroupControl.groupControls
            .find(control => control.key === 'sampleFrequency') as GroupControl;
        return sampleFrequencyGroupControl.groupControls;
    }
}
