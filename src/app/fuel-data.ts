import {Contacts} from './fuel-contacts/fuel-contacts';
import {Petrol} from './fuel-petrol/petrol';


export class NestedFormData {
    testField1: string;
    testField2: string;
    calendarField1: string;
}


export class FuelData {
    fuelContacts: Contacts = new Contacts();
    petrol: FuelPetrol = new FuelPetrol();
    nestedFormValidation: NestedFormData = new NestedFormData();
}

export class FuelPetrol {
    petrols: Petrol[];
}
