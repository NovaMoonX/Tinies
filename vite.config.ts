import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
	plugins: [react(), tailwindcss(), qrcode()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@tinies': path.resolve(__dirname, './src/tinies'),
			'@components': path.resolve(__dirname, './src/components'),
			'@contexts': path.resolve(__dirname, './src/contexts'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@lib': path.resolve(__dirname, './src/lib'),
			'@routes': path.resolve(__dirname, './src/routes'),
			'@screens': path.resolve(__dirname, './src/screens'),
			'@store': path.resolve(__dirname, './src/store'),
			'@styles': path.resolve(__dirname, './src/styles'),
			'@ui': path.resolve(__dirname, './src/ui'),
			'@utils': path.resolve(__dirname, './src/utils'),
		},
	},
	build: {
		chunkSizeWarningLimit: 1000, // in KB. 1000 - 1500 is good for most apps.
	},
	server: {
		port: 3844, // moon is ~384,400 km from earth
	},
});
