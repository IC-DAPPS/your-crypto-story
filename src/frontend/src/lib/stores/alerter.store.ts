import { type Writable, writable } from 'svelte/store';

export interface AlerterStoreData {
	level?: 'primary' | 'success' | 'error' | 'info' | 'warn';
	message: string;
	title?: string;
	showAlert: boolean;
}

export interface AlerterStore extends Writable<AlerterStoreData[]> {
	show: (arg: {
		level?: 'primary' | 'success' | 'error' | 'info' | 'warn';
		message: string;
		title?: string;
	}) => void;
	remove: (index: number) => void;
}

const init = (): AlerterStore => {
	const { subscribe, set, update } = writable<AlerterStoreData[]>([]);

	return {
		subscribe,
		set,
		update,
		show: (arg: {
			level?: 'primary' | 'success' | 'error' | 'info' | 'warn';
			message: string;
			title?: string;
		}) => {
			update((alerts: AlerterStoreData[]) => {
				return [{ showAlert: true, ...arg }, ...alerts];
			});
		},
		remove: (index: number) => {
			update((alerts: AlerterStoreData[]) => {
				return alerts.filter((_, i) => i !== index);
			});
		}
	};
};

export const alerterStore: AlerterStore = init();
