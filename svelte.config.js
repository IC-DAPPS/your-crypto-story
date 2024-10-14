import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import { readFileSync } from 'fs';
import { sveltePreprocess } from 'svelte-preprocess';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const { version } = JSON.parse(json);

const filesPath = (path) => `src/frontend/${path}`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sveltePreprocess({
		postcss: {
			plugins: [autoprefixer]
		}
	}),
	kit: {
		adapter: adapter({
			fallback: 'index.html',
			precompress: false
		}),
		files: {
			assets: filesPath('static'),
			hooks: {
				client: filesPath('src/hooks.client'),
				server: filesPath('src/hooks.server')
			},
			lib: filesPath('src/lib'),
			params: filesPath('src/params'),
			routes: filesPath('src/routes'),
			serviceWorker: filesPath('src/service-worker'),
			appTemplate: filesPath('src/app.html'),
			errorTemplate: filesPath('src/error.html')
		},
		alias: {
			'@components/*': './src/frontend/src/lib/components/*',
			'@constants/*': './src/frontend/src/lib/constants/*',
			'@declarations/*': './src/declarations/*',
			'@services/*': './src/frontend/src/lib/services/*',
			'@stores/*': './src/frontend/src/lib/stores/*',
			'@utils/*': './src/frontend/src/lib/utils/*',
			'@env/*': './src/frontend/src/env'
		}
	},
	serviceWorker: {
		register: false
	},
	version: {
		name: version
	},
	trailingSlash: 'always'
};
export default config;
