export interface FormError {
    controlKey: string;
    errors: ErrorTuple[];
}

export interface ErrorTuple {
    errorName: string;
    errorMessage: string;
}

export interface ValidationErrorMessage {
    controlKey: string;
    validationTuple: ErrorTuple[];
}

export interface ValidationTuple {
    errorName: string;
    validationMessage: string;
}
