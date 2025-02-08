import config from '@cycraft/eslint/config'

export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
