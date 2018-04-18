export class Petrol {
    id: string;
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
    sampleFrequency:MonthSample
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

export class MonthSample {
    // month: MonthEnum;
    value: number;
}

// export enum MonthEnum {
//     January = 1,
//     February,
//     March,
//     April,
//     May,
//     June,
//     July,
//     August,
//     September,
//     Octomber,
//     November,
//     December
// }
