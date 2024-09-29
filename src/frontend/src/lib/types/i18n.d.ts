import type { Languages } from './languages';

interface I18nAuth {
	notify: {
		loading: string;
		success: string;
		canceled: string;
		error: string;
		sign_out: string;
	};
	text: {
		authenticate: string;
		logout: string;
	};
}

interface I18nNavigation {
	home: string;
	transactions: string;
	portfolio: string;
	story: string;
}

interface I18n {
	lang: Languages;
	auth: I18nAuth;
	navigation: I18nNavigation;
}
