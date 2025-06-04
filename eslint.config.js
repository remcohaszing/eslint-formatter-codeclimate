import { define } from '@remcohaszing/eslint'

export default define([
  { ignores: ['fixtures'] },
  {
    rules: {
      camelcase: 'off'
    }
  }
])
