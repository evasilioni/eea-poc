import {Injectable} from '@angular/core';
import {Operation, Relation, Relative} from './control-relation';
import {AbstractControl, FormGroup} from '@angular/forms';
import {BaseControl} from '../controls/base-control';

@Injectable()
export class RelationService {

    constructor() {
    }

    handleRelations(form: FormGroup, controls: BaseControl<string>[], disabledControls: AbstractControl[]): AbstractControl[] {
        const controlsToDisable: AbstractControl[] = [];
        controls.forEach(control => {
            if (control.relations) {
                control.relations.forEach((relation: Relation) => {
                    const relativeValuesMatch: boolean[] = [];
                    relation.relatives.forEach((relative: Relative) => {
                        const formControl = form.get(relative.key);
                        relativeValuesMatch.push(formControl.value === relative.value);
                    });
                    let disable = false;
                    if (relation.operation === Operation.AND) {
                        disable = relativeValuesMatch.every(match => true);
                    } else if (relation.operation === Operation.OR) {
                        disable = relativeValuesMatch.some(match => true);
                    } else {
                        disable = relativeValuesMatch[0] === true;
                    }
                    if (disable) {
                        const formControl = form.get(control.key);
                        controlsToDisable.push(formControl);
                    }
                });
            }
        });
        controlsToDisable.forEach((control: AbstractControl) => {
            if (control.enabled) {
                control.disable();
            }
        });

        disabledControls
            .filter(control => !controlsToDisable.includes(control))
            .forEach(control => {
                if (control.disabled) {
                    control.enable();
                }
            });

        return [...controlsToDisable];
    }
}
