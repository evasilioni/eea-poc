import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {Contacts} from './fuel-contacts';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FuelContactsService} from './fuel-conacts.service';
import {BaseControl} from '../dynamic-forms/controls/base-control';
import {TextboxControl} from '../dynamic-forms/controls/textbox-control';

@Component({
    selector: 'fuel-contacts',
    templateUrl: './fuel-contacts.component.html',
    styleUrls: ['./fuel-contacts.component.css']
})
export class FuelContactsComponent implements OnInit, AfterContentInit {


    @Input()
    contacts: Contacts;

    @Input() parentForm: FormGroup;

    dynamicForm: FormGroup;

    controls: BaseControl<any>[];

    customControls: BaseControl<any>[] = [];

    generalSummary: BaseControl<string>;

    constructor(private http: HttpClient, private fb: FormBuilder, private fuelContactsService: FuelContactsService) {
        console.log('create fuel contacts')
        this.createCustomControls();
    }


    ngOnInit() {

        this.controls = this.fuelContactsService.getControls();
    }

    ngAfterContentInit(): void {
        // this.dynamicForm.addControl('generalSummary', this.fb.control({}));
    }

    onSubmit($event: FormGroup) {
        if ($event.valid) {
            this.contacts = this.prepareSaveFuelContact($event);
        } else {
            alert('Validations!!!');
        }

    }

    prepareSaveFuelContact(form: FormGroup): Contacts {
        return form.value;
    }

    /**
     * Gets a reference to the dynamic form group (for example to manually add extra non-dynamic controls).
     */
    retrieveFormGroup(formGroup: FormGroup) {
        this.dynamicForm = formGroup;
    }

    // create a custom control, which means this will not be rendered automatically, it must be set in the template
    private createCustomControls() {

        this.generalSummary = new TextboxControl({
            key: 'generalSummary',
            label: 'General Summary'
        });

        this.customControls.push(this.generalSummary);
    }
}


