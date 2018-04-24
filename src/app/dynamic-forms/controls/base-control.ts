import {Relation} from '../relation/control-relation';
import {ValidatorConfig} from '../validation/validator-config';


const DEFAULT_LABEL_CSS_CLASSES = ['ui-g-2', 'ui-sm-6'];

const DEFAULT_CONTROL_CSS_CLASSES = ['ui-g-2', 'ui-sm-6'];

export enum ControlType {
    TEXT,
    CALENDAR,
    AUTOCOMPLETE,
    GROUP,
    ARRAY
    // ...
}

export class BaseControl<T> {
    value: T;
    key: string;
    label: string;
    // required: boolean;
    order: number;
    controlType: ControlType;
    validators: ValidatorConfig[];
    labelCssClasses: string[];
    controlCssClasses: string[];
    disabled: () => boolean;
    relations: Relation[];


    constructor(options: BaseControlOptions<T> = {}) {
        this.value = options.value;
        if (!options.key) {
            throw Error('[key] is a mandatory field for a control');
        }
        this.key = options.key;
        this.label = options.label || '';
        // this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || ControlType.TEXT;
        this.validators = options.validators || [];
        this.labelCssClasses = options.labelCssClasses || DEFAULT_LABEL_CSS_CLASSES;
        this.controlCssClasses = options.controlCssClasses || DEFAULT_CONTROL_CSS_CLASSES;
        this.disabled = options.disabled || (() => false);
        this.relations = options.relations || [];
    }
}

export interface BaseControlOptions<T> {
    value?: T;
    key?: string;
    label?: string;
    // required?: boolean;
    order?: number;
    controlType?: ControlType;
    validators?: ValidatorConfig[];
    controlCssClasses?: string[];
    labelCssClasses?: string[];
    disabled?: () => boolean;
    relations?: Relation[];
}
