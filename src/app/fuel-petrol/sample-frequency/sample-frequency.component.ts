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

    controls: BaseControl<string>[];

    @Input() group: any;

    @Input() value: any;

    constructor() {
        this.groupName = 'sampleFrequency';
    }

    ngOnInit() {
        this.controls = this.getSampleFrequencyControls();
    }

    getControls(): BaseControl<string>[] {
        return [
            new GroupControl({
                key: 'sampleFrequency',
                groupControls: this.getSampleFrequencyControls()
            })
        ];
    }

    getSampleFrequencyControls(): BaseControl<string>[] {
        return [
            // new TextboxControl({key: 'Jan', label: 'January'}),
            // new TextboxControl({key: 'Feb', label: 'February'}),
            // new TextboxControl({key: 'Mar', label: 'March'}),
            // new TextboxControl({key: 'Apr', label: 'April'}),
            // new TextboxControl({key: 'May', label: 'May'}),
            // new TextboxControl({key: 'Jun', label: 'June'}),
            // new TextboxControl({key: 'Jun', label: 'July'}),
            // new TextboxControl({key: 'Aug', label: 'August'}),
            // new TextboxControl({key: 'Sep', label: 'September'}),
            // new TextboxControl({key: 'Oct', label: 'October'}),
            // new TextboxControl({key: 'Nov', label: 'November'}),
            // new TextboxControl({key: 'Dec', label: 'December'}),
            new TextboxControl({key: 'totalMonthValue', label: 'Total Month Samples', disabled: () => true})
        ];
    }
}


