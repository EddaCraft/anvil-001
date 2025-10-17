import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
// import jsonPlugin from '@eslint/json'; // TODO: Re-enable once compatible with ESLint 9

export default typescriptEslint.config(
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      '**/dist/',
      '**/node_modules/',
      '**/.nx/',
      '**/coverage/',
      '**/playwright-report/',
      'eslint.config.mts',
      '**/*.md',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
  },
  // JSON files - temporarily disabled due to compatibility issues
  // TODO: Re-enable once @eslint/json is properly configured for ESLint 9
  // React files
  {
    files: ['**/*.jsx', '**/*.tsx'],
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        allowDefaultProject: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/vitest.config.ts',
      '**/jest.config.ts',
      '**/scripts/**/*.ts',
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        allowDefaultProject: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['cli/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  }
);
