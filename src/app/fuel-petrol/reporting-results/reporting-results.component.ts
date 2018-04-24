import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'reporting-results',
    templateUrl: './reporting-results.component.html',
    styleUrls: ['./reporting-results.component.css']
})
export class ReportingResultsComponent implements OnInit {


    @Input() reportResultTypes: any[];

    @Input() controls: any[];

    @Input() group: any;

    constructor() {

    }

    ngOnInit() {
    }

}
