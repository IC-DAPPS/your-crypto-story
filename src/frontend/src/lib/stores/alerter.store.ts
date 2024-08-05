import { type Writable, writable } from 'svelte/store';

export interface AlerterStoreData {
	level?: 'primary' | 'success' | 'error' | 'info' | 'warn';
	message: string;
	showAlert: boolean;
}

export interface AlerterStore extends Writable<AlerterStoreData[]> {
	show: (arg: {
		level?: 'primary' | 'success' | 'error' | 'info' | 'warn';
		message: string;
	}) => void;
	remove: (index: number) => void;
}

const init = (): AlerterStore => {
	const { subscribe, set, update } = writable<AlerterStoreData[]>([]);

	return {
		subscribe,
		set,
		update,
		show: (arg: { level?: 'primary' | 'success' | 'error' | 'info' | 'warn'; message: string }) => {
			update((alerts: AlerterStoreData[]) => {
				return [{ showAlert: true, level: arg.level, message: arg.message }, ...alerts];
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
