export enum Action {
    DISABLE,

}

export enum Operation {
    AND,
    OR
}

/**
 * If key is nested it should be of the form 'parent.key'
 */
export interface Relative {
    key: string;
    value: string;
}

export interface Relation {
    action: Action;
    operation?: Operation;
    relatives: Relative[];
}
