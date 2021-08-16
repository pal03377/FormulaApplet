import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';

const production = process.env.PRODUCTION === "true";
console.log("PRODUCTION", production, "(env: " + process.env.PRODUCTION + ")");


export default {
	input: 'src/main.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'), 
			preventAssignment: true
		}),
		json(),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
			mainFields: ['main', 'module']
		}),
		builtins(),
		commonjs({
			preferBuiltins: false
		}),
		production && babel({ babelHelpers: 'bundled' }),

		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when serving
		!production && livereload("public", { port: 5001 }),

		// If we're building for production, minify
		production && terser()
	]
};


function serve() {
	console.log("serving...");
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'public', '--', '--dev'], {
					env: process.env,
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
