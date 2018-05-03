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

    @Input() controls: BaseControl<string>[];

    @Input() group: any;

    @Input() value: any;

    constructor() {
        this.groupName = 'sampleFrequency';
    }

    ngOnInit() {
    }


}


