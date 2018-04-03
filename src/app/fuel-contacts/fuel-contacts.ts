export class Contacts {
    country: string;
    dateReportCompleted: Date;
    organisationResponsibleForReport: string;
    organisationAddress: Address;
    personResponsibleForReport: string;
    personInfo: PersonInfo;
    generalSummary: string;
}

export class Address {
    street: string;
    city: string;
    postcode: string;
}


export class PersonInfo {
    phoneNumber: string;
    email: string;
}