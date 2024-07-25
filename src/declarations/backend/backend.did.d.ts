import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type DeleteError = { 'IndexOutOfBounds' : null } |
  { 'DidntFindUserData' : null } |
  { 'AnonymousCaller' : null };
export type GetUserDataError = { 'DidntFindUserData' : null } |
  { 'AnonymousCaller' : null };
export interface PrincipalName { 'principal' : Principal, 'name' : string }
export type Result = { 'Ok' : null } |
  { 'Err' : DeleteError };
export type Result_1 = { 'Ok' : UserData } |
  { 'Err' : GetUserDataError };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : GetUserDataError };
export interface UserData {
  'owned_principals' : Array<PrincipalName>,
  'known_principals' : Array<PrincipalName>,
}
export interface _SERVICE {
  'delete_known_principal' : ActorMethod<[bigint], Result>,
  'delete_owned_principal' : ActorMethod<[bigint], Result>,
  'get_userdata' : ActorMethod<[], Result_1>,
  'greet' : ActorMethod<[string], string>,
  'insert_known_principals' : ActorMethod<[Array<PrincipalName>], Result_2>,
  'insert_owned_principals' : ActorMethod<[Array<PrincipalName>], Result_2>,
  'insert_userdata' : ActorMethod<[], Result_2>,
  'update_known_principal_name' : ActorMethod<[string, bigint], Result>,
  'update_owned_principal_name' : ActorMethod<[string, bigint], Result>,
  'whoami' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
