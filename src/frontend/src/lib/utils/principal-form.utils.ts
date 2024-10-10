import { Principal } from '@dfinity/principal';
import type { PrincipalNameInput } from '$lib/types/principal-name';
import { get } from 'svelte/store';
import { i18n } from '@stores/i18n.store';

export const validatePrincipal = (principal: string): boolean => {
	try {
		Principal.fromText(principal);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const validatePrincipalAlias = (name: string): boolean => {
	return name.trim().length >= 3 && name.length <= 60;
};

export const isPrincipalUnique = (
	principal: string,
	index: number,
	groupOfInputs: PrincipalNameInput[]
): boolean => {
	return groupOfInputs.every((value, i) => i === index || value.principal !== principal);
};

export const getButtonState = (groupOfInputs: PrincipalNameInput[]): boolean => {
	return groupOfInputs.some(
		(value, index) =>
			!validatePrincipalAlias(value.name) ||
			!validatePrincipal(value.principal) ||
			!isPrincipalUnique(value.principal, index, groupOfInputs)
	);
};

export const handleInputs = (
	field: 'name' | 'principal',
	value: PrincipalNameInput,
	groupOfInputs: PrincipalNameInput[]
) => {
	if (field === 'name') {
		value.name = value.name.replace(/^\s+/, ''); // Remove leading whitespace
		value.nameInputTouched = true;
	} else {
		value.principalInputTouched = true;
	}

	return getButtonState(groupOfInputs);
};

export const shouldShowPrincipalAliasError = (value: PrincipalNameInput): boolean => {
	return value.nameInputTouched && !validatePrincipalAlias(value.name);
};

export const shouldShowPrincipalError = (
	value: PrincipalNameInput,
	index: number,
	groupOfInputs: PrincipalNameInput[]
): boolean => {
	return (
		value.principalInputTouched &&
		(!validatePrincipal(value.principal) ||
			!isPrincipalUnique(value.principal, index, groupOfInputs))
	);
};

export const getPrincipalAliasErrorMessage = (name: string): string => {
	if (name.trim().length < 3) {
		return get(i18n).userdata.assertion.principal_alias_name_minimum;
	} else if (name.length > 60) {
		return get(i18n).userdata.assertion.principal_alias_name_maximum;
	}
	return '';
};

export const getPrincipalErrorMessage = (
	principal: string,
	index: number,
	groupOfInputs: PrincipalNameInput[]
): string => {
	if (!validatePrincipal(principal)) {
		return get(i18n).userdata.assertion.principal_invalid;
	} else if (!isPrincipalUnique(principal, index, groupOfInputs)) {
		return get(i18n).userdata.assertion.unique_principal;
	}
	return '';
};

export const addNewPrincipalNameForm = (groupOfInputs: PrincipalNameInput[]) => {
	groupOfInputs.push({
		name: '',
		principal: '',
		nameInputTouched: false,
		principalInputTouched: false
	});
	return {
		newGroupOfInputs: groupOfInputs,
		newButtonState: getButtonState(groupOfInputs)
	};
};

export const deleteValue = (index: number, groupOfInputs: PrincipalNameInput[]) => {
	const newGroupOfInputs = groupOfInputs.filter((_, i) => i !== index);

	return {
		newGroupOfInputs,
		newButtonState: getButtonState(newGroupOfInputs)
	};
};
