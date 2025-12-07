// eslint.config.mjs
// @ts-check
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import eslint from '@eslint/js'

export default defineConfig(
	{
		ignores: [
			'eslint.config.mjs',
			'dist/**',
			'node_modules/**',
			'coverage/**',
			'**/*.js'
		]
	},
	eslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest
			},
			sourceType: 'module',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			'prettier/prettier': 0
		}
	}
)
