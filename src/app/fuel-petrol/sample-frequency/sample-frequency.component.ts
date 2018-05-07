import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { BaseControl } from '../../dynamic-forms/controls/base-control';
import { TextboxControl } from '../../dynamic-forms/controls/textbox-control';
import { GroupControl } from '../../dynamic-forms/controls/group-controll';

@Component({
    selector: 'sample-frequency',
    templateUrl: './sample-frequency.component.html',
    styleUrls: ['./sample-frequency.component.css']
})
export class SampleFrequencyComponent implements OnInit {

    groupName: string;
    monthsArray: string[];

    @Input() controls: BaseControl<string>[];

    @Input() group: any;

    @Input() value: any;

    constructor() {
        this.groupName = 'sampleFrequency';

        this.monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    ngOnInit() {
        this.monthsArray.forEach(m => {
            if (this.group.controls.sampleFrequency.controls[m]) {
                this.group.controls.sampleFrequency.controls[m].valueChanges
                .subscribe(data => this.onChanges(m, data));
            }
        });
    }


    onChanges(month: string, monthValue: any) {
        // tslint:disable-next-line:radix
        let totalMonthValue = 0;
        this.monthsArray.filter(m => m !== month).forEach(m => {
            totalMonthValue +=  this.getNumber(this.group.controls.sampleFrequency.controls[m].value);
        });
        totalMonthValue +=  this.getNumber(monthValue);
        this.group.controls.sampleFrequency.controls['totalMonthValue'].setValue(totalMonthValue);
    }


    getNumber(monthValue: any) {
        // tslint:disable-next-line:radix
        return isNaN(parseInt(monthValue)) ? 0 : parseInt(monthValue);
    }
}


