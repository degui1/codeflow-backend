import globals from 'globals'
import pluginJs from '@eslint/js'
import { config, configs } from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import importPlugin from 'eslint-plugin-import'
import pluginPromise from 'eslint-plugin-promise'

/** @type {import('eslint').Linter.Config[]} */

export default config([
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
  },
  {
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
  configs.strict,
  configs.stylistic,
  {
    rules: {
      quotes: ['error', 'single'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-irregular-whitespace': 'error',
      'no-multi-spaces': 'error',
      'prettier/prettier': 'error',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.mjs', '.ts'],
        },
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    ignores: ['node_modules', 'build'],
  },
  eslintPluginPrettierRecommended,
  pluginPromise.configs['flat/recommended'],
])
