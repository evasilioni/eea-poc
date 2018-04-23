import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'reporting-result',
    templateUrl: './reporting-result.component.html',
    styleUrls: ['./reporting-result.component.css']
})
export class ReportingResultComponent implements OnInit {

    @Input() groupName: string;

    @Input() controls: FormControl[];

    @Input() group: any;

    constructor() {
    }

    ngOnInit() {
    }

}
