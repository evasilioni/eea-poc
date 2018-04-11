import {Contacts} from './fuel-contacts/fuel-contacts';


export class NestedFormData {
    testField1: string;
    testField2: string;
}


export class FuelData {
    fuelContacts: Contacts = new Contacts();
    petrol: any;
    nestedFormValidation: NestedFormData = new NestedFormData();
}
