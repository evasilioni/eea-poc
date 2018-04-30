import {Component, Input, OnInit} from '@angular/core';
import {BaseControl} from '../../../dynamic-forms/controls/base-control';

@Component({
    selector: 'reporting-result',
    templateUrl: './reporting-result.component.html',
    styleUrls: ['./reporting-result.component.css']
})
export class ReportingResultComponent implements OnInit {

    @Input() groupName: string;

    @Input() controls: BaseControl<string>[];

    @Input() group: any;

    @Input() value: any;

    constructor() {
    }

    ngOnInit() {
    }

}
