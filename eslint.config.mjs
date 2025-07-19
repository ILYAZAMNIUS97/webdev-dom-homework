import pluginJs from '@eslint/js'
import globals from 'globals'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import configPrettier from 'eslint-config-prettier'
import html from 'eslint-plugin-html'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  configPrettier,
  pluginPrettier,

  // Поддержка HTML
  {
    files: ['**/*.html'],
    plugins: {
      html,
    },
    rules: {
      'html/no-duplicate-attr': 'error',
      'html/no-dup-id': 'warn',
    },
  },
]
