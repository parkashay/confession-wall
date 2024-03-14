
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface RegisterCredentialsInput {
    fullname: string;
    email: string;
    password: string;
}

export interface LoginCredentialsInput {
    email: string;
    password: string;
}

export interface ConfessionInput {
    to: string;
    title: string;
    content: string;
}

export interface LikeInput {
    id: string;
    type: number;
}

export interface IQuery {
    currentUser(): AuthResponse | Promise<AuthResponse>;
    getAllConfessions(): Nullable<Nullable<Confession>[]> | Promise<Nullable<Nullable<Confession>[]>>;
    getUserConfessions(): Nullable<ConfessionsByUser> | Promise<Nullable<ConfessionsByUser>>;
}

export interface IMutation {
    registerWithCredentials(input: RegisterCredentialsInput): AuthResponse | Promise<AuthResponse>;
    loginWithCredentials(input: LoginCredentialsInput): AuthResponse | Promise<AuthResponse>;
    loginWithGoogle(token: string): AuthResponse | Promise<AuthResponse>;
    createConfession(confession: ConfessionInput): UnionResponse | Promise<UnionResponse>;
    deleteConfession(id: string): string | Promise<string>;
    likeConfession(input: LikeInput): UnionResponse | Promise<UnionResponse>;
}

export interface User {
    id: string;
    name: string;
    email: string;
    confessions?: Nullable<Nullable<Confession>[]>;
}

export interface Confession {
    id: string;
    to: string;
    title: string;
    content: string;
    likes?: Nullable<number>;
    user?: Nullable<User>;
}

export interface Error {
    message: string;
}

export interface ConfessionArray {
    confessions: Nullable<Confession>[];
}

export type AuthResponse = User | Error;
export type UnionResponse = Confession | Error;
export type ConfessionsByUser = ConfessionArray | Error;
type Nullable<T> = T | null;
