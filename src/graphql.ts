
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface ConfessionInput {
    to: string;
    title: string;
    content: string;
}

export interface LikeInput {
    id: string;
    type: number;
}

export interface Error {
    message: string;
}

export interface Confession {
    id: string;
    to: string;
    title: string;
    content: string;
    likes?: Nullable<number>;
}

export interface IQuery {
    test(): Nullable<string> | Promise<Nullable<string>>;
    testWithVariable(name: string): Nullable<string> | Promise<Nullable<string>>;
    getAllConfessions(): Nullable<Nullable<Confession>[]> | Promise<Nullable<Nullable<Confession>[]>>;
}

export interface IMutation {
    createConfession(confession: ConfessionInput): UnionResponse | Promise<UnionResponse>;
    deleteConfession(id: string): string | Promise<string>;
    likeConfession(input: LikeInput): UnionResponse | Promise<UnionResponse>;
}

export type UnionResponse = Confession | Error;
type Nullable<T> = T | null;
