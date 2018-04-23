import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'sample-frequency',
    templateUrl: './sample-frequency.component.html',
    styleUrls: ['./sample-frequency.component.css']
})
export class SampleFrequencyComponent implements OnInit {

    @Input('group')
    sampleFrequencyForm: FormGroup;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
    }
}


