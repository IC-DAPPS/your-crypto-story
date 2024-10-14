export const INTERNET_IDENTITY_CANISTER_ID =
	(import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY as string) ?? 'rdmx6-jaaaa-aaaaa-aaadq-cai';

export const BACKEND_CANISTER_ID = import.meta.env.VITE_BACKEND_CANISTER_ID as string;

export const Network = import.meta.env.VITE_DFX_NETWORK as 'local' | 'ic';

export const HOST = import.meta.env.VITE_HOST as string;
export const LOCAL = Network === 'local';
export const PROD = Network === 'ic';

// How long the delegation identity should remain valid?
// e.g. BigInt(60 * 60 * 1000 * 1000 * 1000) = 1 hour in nanoseconds
export const AUTH_MAX_TIME_TO_LIVE = BigInt(60 * 60 * 1000 * 1000 * 1000);

export const AUTH_POPUP_WIDTH = 576;
export const AUTH_POPUP_HEIGHT = 625;
