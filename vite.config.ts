import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import postcss from './postcss.config.cjs';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [vue(), tsconfigPaths()],
	css:{
		postcss
	},
	resolve: {
		alias: {
			src: '/src',
		},
	},
	optimizeDeps: {
		include: ['vue-router']
	}
});
