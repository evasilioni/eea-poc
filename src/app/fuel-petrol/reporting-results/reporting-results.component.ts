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

    @Input()  controls: BaseControl<string>[];

    @Input() group: any;

    @Input() value: any;

    years: any[];
    petrolFormValidator: PetrolFormValidators;

    groupValidators: ValidatorFn[] = [];

    private filteredYears = {value: []};

    constructor(private configService: ConfigService) {
        this.years = [{'year': '2005'},
        {'year': '2006'},
        {'year': '2007'},
        {'year': '2008'},
        {'year': '2009'}];
    }

    ngOnInit() {
        this.petrolFormValidator = new PetrolFormValidators(this.configService);
        console.log('group validity', this.group.valid);
        console.log('group', this.group);
    }

    filteredControls(key) {
        const petrolControls = (this.controls.filter(control => control.key === key)[0] as GroupControl);
        this.groupValidators = petrolControls.groupValidators;
        return petrolControls.groupControls;
    }

}
