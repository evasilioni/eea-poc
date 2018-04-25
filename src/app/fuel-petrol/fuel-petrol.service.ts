
import { Injectable } from '@angular/core';

import { PetrolService } from '../services/fuel-petrol-service/petrol.service';
import { ConfigService } from '../services/config.service';
import { ArrayControl } from '../dynamic-forms/controls/array-control';
import { TextboxControl } from '../dynamic-forms/controls/textbox-control';
import { GroupControl } from '../dynamic-forms/controls/group-controll';
import { BaseControl } from '../dynamic-forms/controls/base-control';

@Injectable()
export class FuelPetrolService {

    constructor(private petrolService: PetrolService,
        private configService: ConfigService) { }


    getControls(): BaseControl<string>[] {
        const controls: BaseControl<string>[] = [
            new ArrayControl({
                key: 'petrols',
                arrayControls: [
                    // new GroupControl({
                    //     key: 'petrol',
                    //     groupControls: [
                    //         new TextboxControl({
                    //             key: 'country',
                    //             label: 'Country'
                    //         }),
                    //         new TextboxControl({
                    //             key: 'reportingYear',
                    //             label: 'Reporting Year'
                    //         })
                    //     ]
                    // })
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
                    })
                ]
            });
    }
}