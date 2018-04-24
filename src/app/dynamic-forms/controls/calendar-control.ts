import { ControlType, BaseControlOptions, BaseControl } from "./base-control";

export class CalendarControl extends BaseControl<string> {
    controlType = ControlType.CALENDAR;
    dateFormat: string;
    showIcon: boolean;

    constructor(options: CalendarControlOptions<string> = {}){
        super(options);
        this.dateFormat = options.dateFormat;
        this.showIcon = options['showIcon'];
    }

    //dateFormat="dd/mm/y" [showIcon]="true"
}

export interface CalendarControlOptions<T> extends BaseControlOptions<string> {
    showIcon?: boolean;
    dateFormat?: string;
}
