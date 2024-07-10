module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  ignorePatterns: ['dist', '.eslintrc.cjs'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },

  plugins: [
    'react',
    'react-hooks',
    'react-refresh',
    'import',
    'flowtype',
    'jsx-a11y',
    // 'jest',
    // 'testing-library',

  ],
  extends: [
    'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended-type-checked',  // less strict
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  settings: {
    "react": { "version": "detect"}
  },

  rules: {
    "eqeqeq": ["error"],

    // Default exports allow renaming on import, which can lead to confusing
    // code. IMO, we should ban them. Do we need to upgrade eslint or
    // something?
    // "no-default-export": ["warn"],

    // migrated from:
    // https://github.com/facebook/create-react-app/blob/0a827f69ab0d2ee3871ba9b71350031d8a81b7ae/packages/eslint-config-react-app/index.js
    /// TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
    'default-case': 'off',
    /// 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
    // 'no-dupe-class-members': 'off',
    /// 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
    // 'no-undef': 'off',

    // react
    ////////
    "react/function-component-definition": [
      "error",
      {
        "namedComponents": "arrow-function",
        "unnamedComponents": "arrow-function",
      },
    ],

    // migrated from:
    // https://github.com/facebook/create-react-app/blob/0a827f69ab0d2ee3871ba9b71350031d8a81b7ae/packages/eslint-config-react-app/base.js
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'warn',

    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // typescript
    /////////////
    "@typescript-eslint/ban-ts-comment": [
      "warn",
      {
        "ts-ignore": "allow-with-description",
      },
    ],

    /// Add TypeScript specific rules (and turn off ESLint equivalents)
    // '@typescript-eslint/consistent-type-assertions': 'warn',  // defaults to "error"
    'no-array-constructor': 'off',
    // '@typescript-eslint/no-array-constructor': 'warn',  // default to "error"
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'warn',
      {
        functions: false,
        classes: false,
        variables: false,
        typedefs: false,
      },
    ],
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    'no-unused-vars': 'off',
    // '@typescript-eslint/no-unused-vars': [
    //   'warn',
    //   {
    //     args: 'none',
    //     ignoreRestSiblings: true,
    //   },
    // ],  // default "error"
    'no-useless-constructor': 'off',
    // '@typescript-eslint/no-useless-constructor': 'warn',  // default "error"

    /*
    // migrated from:
    // https://github.com/facebook/create-react-app/blob/0a827f69ab0d2ee3871ba9b71350031d8a81b7ae/packages/eslint-config-react-app/jest.js
    /// https://github.com/jest-community/eslint-plugin-jest
    'jest/no-conditional-expect': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-interpolation-in-snapshots': 'error',
    'jest/no-jasmine-globals': 'error',
    'jest/no-mocks-import': 'error',
    'jest/valid-describe-callback': 'error',
    'jest/valid-expect': 'error',
    'jest/valid-expect-in-promise': 'error',
    'jest/valid-title': 'warn',

    /// https://github.com/testing-library/eslint-plugin-testing-library
    'testing-library/await-async-queries': 'error',
    'testing-library/await-async-utils': 'error',
    'testing-library/no-await-sync-queries': 'error',
    'testing-library/no-container': 'error',
    'testing-library/no-debugging-utils': 'error',
    'testing-library/no-dom-import': ['error', 'react'],
    'testing-library/no-node-access': 'error',
    'testing-library/no-promise-in-fire-event': 'error',
    'testing-library/no-render-in-lifecycle': 'error',
    'testing-library/no-unnecessary-act': 'error',
    'testing-library/no-wait-for-multiple-assertions': 'error',
    'testing-library/no-wait-for-side-effects': 'error',
    'testing-library/no-wait-for-snapshot': 'error',
    'testing-library/prefer-find-by': 'error',
    'testing-library/prefer-presence-queries': 'error',
    'testing-library/prefer-query-by-disappearance': 'error',
    'testing-library/prefer-screen-queries': 'error',
    'testing-library/render-result-naming-convention': 'error',
    // end migrated config
		*/
  },
}
