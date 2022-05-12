import commonjs from "@rollup/plugin-commonjs"

export default [
	{
		input: './src/index.js',
		output: {
			file: './oscfp.js',
			format: 'umd',
			name: 'osc',
		},
		plugins: [
			commonjs(),
		],
	}
]