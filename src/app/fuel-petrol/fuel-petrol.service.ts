import {Injectable} from '@angular/core';


import {ArrayControl} from '../dynamic-forms/controls/array-control';
import {TextboxControl} from '../dynamic-forms/controls/textbox-control';
import {GroupControl} from '../dynamic-forms/controls/group-controll';
import {BaseControl, ControlType} from '../dynamic-forms/controls/base-control';
import {Validators} from '@angular/forms';
import {ConfigService} from '../services/config.service';
import {PetrolFormValidators} from '../validators/petrol-form-validators';
import {AutocompleteControl} from '../dynamic-forms/controls/autocomplete-control';
import { NumberControl } from '../dynamic-forms/controls/number-control';

@Injectable()
export class FuelPetrolService {
    petrolFormValidator: PetrolFormValidators;

    years: any[];
    private filteredYears = {value: []};

    constructor(private configService: ConfigService) {
        this.years = [{'year': '2005'},
            {'year': '2006'},
            {'year': '2007'},
            {'year': '2008'},
            {'year': '2009'}];

        this.petrolFormValidator = new PetrolFormValidators(configService);
    }


    getControls(): BaseControl<string>[] {
        const controls: BaseControl<string>[] = [
            new ArrayControl({
                key: 'petrols',
                arrayControls: []
            })
        ];

        // controls.sort((a, b) => a.order - b.order);
        return controls;
    }

    createPetrolGroupControl(): GroupControl {
        return new GroupControl({
            key: 'petrol',
            groupValidators: [
                this.petrolFormValidator.numOfSampleFrequencyValidation(),
                this.petrolFormValidator.uniqueCountry()
            ],
            groupControls: [
                new GroupControl({
                    key: 'basicPetrolInfo',
                    groupValidators: [
                        this.petrolFormValidator.periodValidation()
                    ],
                    groupControls: [
                        new TextboxControl({
                            key: 'country',
                            label: 'Country',
                            validators: [
                                {
                                    formError: 'required',
                                    validator: Validators.required,
                                    validationMessage: 'Petrol Country required'
                                }
                            ],
                            labelCssClasses: ['ui-g-4 ui-sm-6']
                        }),
                        new TextboxControl({
                            key: 'reportingYear',
                            label: 'Reporting Year',
                            labelCssClasses: ['ui-g-4 ui-sm-6']
                        }),
                        new TextboxControl({
                            key: 'period',
                            label: 'Period',
                            labelCssClasses: ['ui-g-4 ui-sm-6']
                        }),
                        new TextboxControl({
                            key: 'parentFuelGrade',
                            label: 'Parent Fuel Grade',
                            labelCssClasses: ['ui-g-4 ui-sm-6']
                        }),
                        new TextboxControl({
                            key: 'nationalFuelGrade',
                            label: 'National Fuel Grade',
                            labelCssClasses: ['ui-g-4 ui-sm-6']
                        }),
                        new TextboxControl({
                            key: 'summerPeriodNorA',
                            label: 'Summer Period',
                            labelCssClasses: ['ui-g-4 ui-sm-6']
                        }),
                        new TextboxControl({
                            key: 'maximumBioethanolContent',
                            label: 'Max Bioethanol Content',
                            labelCssClasses: ['ui-g-4 ui-sm-6']
                        })
                    ]
                }),

                new GroupControl({
                    key: 'researchOctaneNumber',
                    groupControls: this.getReportResultGroup(),
                    groupValidators: [this.petrolFormValidator.minMaxValidation()]
                }),
                new GroupControl({
                    key: 'motorOctaneNumber',
                    groupControls: this.getReportResultGroup(),
                    groupValidators: [this.petrolFormValidator.minMaxValidation()]
                }),
                new GroupControl({
                    key: 'vapourPressure',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'distillationEvaporated100',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'distillationEvaporated150',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'hydrocarbonOlefins',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'hydrocarbonAromatics',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'hydrocarbonBenzene',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'oxygenContent',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'oxygenContent2',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'methanol',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'ethanol',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'isoPropylAlcohol',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'tertButylAlcohol',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'isoButylAlcohol',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'ethers',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'sulphurContent',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'leadContent',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'manganese',
                    groupControls: this.getReportResultGroup()
                }),
                new GroupControl({
                    key: 'sampleFrequency',
                    groupControls: this.getSampleFrequencyControls()
                })

            ]
        });
    }

    getReportResultGroup(): BaseControl<string>[] {
        return [
            new TextboxControl({controlType: ControlType.TEXT, key: 'unit', label: 'Unit', disabled: () => true}),
            new TextboxControl({
                controlType: ControlType.TEXT,
                key: 'numOfSamples', label: 'Number Of Samples',
                validators: [
                    {
                        formError: 'required',
                        validator: Validators.required,
                        validationMessage: 'num of samples'
                    }]
            }),
            new TextboxControl({key: 'min', label: 'Min'}),
            new TextboxControl({key: 'max', label: 'Max'}),
            new TextboxControl({key: 'median', label: 'Median'}),
            new TextboxControl({key: 'mean', label: 'Mean'}),
            new TextboxControl({key: 'standardDeviation', label: 'Standard Deviation'}),
            new TextboxControl({key: 'toleranceLimit', label: 'Tolerance Limit'}),
            new TextboxControl({key: 'sampleValue25', label: '25% of Sample Value'}),
            new TextboxControl({key: 'sampleValue75', label: '75% of Sample Value'}),
            new TextboxControl({key: 'nationalMin', label: 'National Min'}),
            new TextboxControl({key: 'nationalMax', label: 'National Max'}),
            new TextboxControl({key: 'directiveMin', label: 'Directive Min'}),
            new TextboxControl({key: 'directiveMax', label: 'Directive Max'}),
            new TextboxControl({key: 'method', label: 'Method'}),
            new AutocompleteControl({
                key: 'date', label: 'Date',
                suggestions: this.filteredYears,
                searchFn: this.searchYears,
                suggestionField: 'year'
            })
        ];
    }

    getSampleFrequencyControls(): BaseControl<string>[] {
        return [
            new NumberControl({key: 'Jan', label: 'January'}),
            new NumberControl({key: 'Feb', label: 'February'}),
            new NumberControl({key: 'Mar', label: 'March'}),
            new NumberControl({key: 'Apr', label: 'April'}),
            new NumberControl({key: 'May', label: 'May'}),
            new NumberControl({key: 'Jun', label: 'June'}),
            new NumberControl({key: 'Jul', label: 'July'}),
            new NumberControl({key: 'Aug', label: 'August'}),
            new NumberControl({key: 'Sep', label: 'September'}),
            new NumberControl({key: 'Oct', label: 'October'}),
            new NumberControl({key: 'Nov', label: 'November'}),
            new NumberControl({key: 'Dec', label: 'December'}),
            new TextboxControl({key: 'totalMonthValue', label: 'Total Month Samples', disabled: () => true})
        ];
    }


    searchYears = (event) => {
        return this.years
            .filter((y: any) => y.year.includes(event.query));
    }
}
