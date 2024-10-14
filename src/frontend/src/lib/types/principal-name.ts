type PrincipalText = string;
type AliasName = string;
export type PrincipalNameMap = Map<PrincipalText, AliasName>;

export interface PrincipalNameInput {
	name: string;
	principal: string;
	nameInputTouched: boolean;
	principalInputTouched: boolean;
}
