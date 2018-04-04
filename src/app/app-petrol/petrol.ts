export class Petrol {
    country: string;
    reportingYear: number;
    period: string;
    parentFuelGrade: string;
    nationalFuelGrade: string;
    summerPeriodNorA: string;
    maximumBioethanolContent: string;
    researchOctaneNumber: ReportResult;
    motorOctanenumber: ReportResult;
    vapourPressure: ReportResult;
    distillationEvaporated100: ReportResult;
    distillationEvaporated150: ReportResult;
}

export class ReportResult {
    unit: string;
    numOfSamples: number;
    min: number;
    max: number;
    median: number;
    standardDeviation: number;
    toleranceLimit: number;
    sampleValue: number;
    nationalMin: number;
    nationalMax: number;
    directiveMin: number;
    directiveMax: number;
    method: string;
    date: string;
}
