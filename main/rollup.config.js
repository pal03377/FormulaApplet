/* eslint-disable no-undef */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
// import babel from '@rollup/plugin-babel';

const production = process.env.PRODUCTION === "true";
console.log("PRODUCTION", production, "(env: " + process.env.PRODUCTION + ")");

const serveWanted = process.env.SERVE === "true";

const h5pCopy = process.env.H5PCOPY === "true";
const h5pBase = "../h5p/development/H5P.FormulaApplet-2.8/";
const h5pScriptsFolder = h5pBase + "scripts/";
const h5pStylesFolder = h5pBase + "styles/";
const h5pEditorBase = "../h5p/development/H5PEditor.FormulaAppletEditor-1.0/"
const h5pEditorScriptsFolder = h5pEditorBase + "scripts/";
const h5pEditorStylesFolder = h5pEditorBase + "styles/";

function getH5Ppath(plugin, extension) {
	if (plugin === "h5p") {
		if (extension === "js") return h5pScriptsFolder;
		else return h5pStylesFolder;
	} else if (plugin === "h5pEditor") {
		if (extension === "js") return h5pEditorScriptsFolder;
		else return h5pEditorStylesFolder;
	}
	throw Error("Unmatched");
}

function getCopyTargets(filename) {
	let targets = [];
	for (let plugin of ["h5p", "h5pEditor"]) {
		let extension;
		if (filename.endsWith(".js")) extension = "js";
		else if (filename.endsWith(".css")) extension = "css";
		else throw Error("Invalid extension");
		targets.push(
			{
				src: `./public/${ filename }`, 
				dest: getH5Ppath(plugin, extension)
			}
		);
		if (!production && extension === "js") {
			targets.push(
				{
					src: `./public/${ filename.replace('.js', '.js.map') }`, 
					dest: getH5Ppath(plugin, extension)
				}
			);
		}
	}
	return targets;
}

export default [{
	input: 'src/main.js',
	output: {
		// sourcemap: !production,
		sourcemap: true,
		format: 'iife',
		name: 'H5Pbridge',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'), 
			'__h5p__': (!!h5pCopy).toString(), 
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
		// production && babel({ babelHelpers: 'bundled' }),

		serveWanted && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when serving
		!production && livereload("public"),

		// If we're building for production, minify
		production && terser(), 

		h5pCopy && copy({
			targets: getCopyTargets("build/bundle.js")
					 .concat(getCopyTargets("css/gf09.css"))
					 .concat(getCopyTargets("css/table.css"))
					 .concat(getCopyTargets("css/virtualKeyboard.css"))
					 .concat(getCopyTargets("MathQuill/mathquill.css"))
		})
	]
}, {
	// license bundle does not have live reload
	input: 'src/mainLicense.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundleLicense.js'
	},
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'), 
			preventAssignment: true
		}),
		json(), 
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
			mainFields: ['main', 'module']
		}),
		builtins(),
		commonjs({
			preferBuiltins: false
		}),
		babel({ babelHelpers: 'bundled' }),
		// minify
		terser(), 

		h5pCopy && copy({
			targets: getCopyTargets("build/bundleLicense.js")
		})
	]
}];


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
