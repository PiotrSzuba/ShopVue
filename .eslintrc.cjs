module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'amd': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		// 'plugin:vue/recommended',
		'plugin:vue/vue3-strongly-recommended',
		// 'plugin:vue/vue3-essential',
		'plugin:@typescript-eslint/recommended'
	],
	'overrides': [
	],
	'parser': 'vue-eslint-parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
		'parser': {
			'ts': '@typescript-eslint/parser',
		}
	},
	'plugins': [
		'vue'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
