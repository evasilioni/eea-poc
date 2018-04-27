
import { Injectable } from '@angular/core';


import { ArrayControl } from '../dynamic-forms/controls/array-control';
import { TextboxControl } from '../dynamic-forms/controls/textbox-control';
import { GroupControl } from '../dynamic-forms/controls/group-controll';
import { BaseControl } from '../dynamic-forms/controls/base-control';

@Injectable()
export class FuelPetrolService {

    constructor() { }


    getControls(): BaseControl<string>[] {
        const controls: BaseControl<string>[] = [
            new ArrayControl({
                key: 'petrols',
                arrayControls: [
                ]
            })
        ];

        // controls.sort((a, b) => a.order - b.order);
        return controls;
    }

    createPetrolGroupControl(): GroupControl {
        return new GroupControl({
            key: 'petrol',
            groupControls: [
                new TextboxControl({
                    key: 'country',
                    label: 'Country'
                }),
                new TextboxControl({
                    key: 'reportingYear',
                    label: 'Reporting Year'
                }),
                new TextboxControl({
                    key: 'period',
                    label: 'Period'
                }),
                new TextboxControl({
                    key: 'parentFuelGrade',
                    label: 'Parent Fuel Grade'
                }),
                new TextboxControl({
                    key: 'nationalFuelGrade',
                    label: 'National Fuel Grade'
                }),
                new TextboxControl({
                    key: 'nationalFuelGrade',
                    label: 'National Fuel Grade'
                }),
                new TextboxControl({
                    key: 'summerPeriodNorA',
                    label: 'Summer Period'
                }),
                new TextboxControl({
                    key: 'maximumBioethanolContent',
                    label: 'Max Bioethanol Content'
                })
            ]
        });
    }
}
