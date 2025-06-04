/**
 * @import { ESLint } from 'eslint'
 */

/**
 * @type {ESLint.Plugin}
 */
const plugin = {
  rules: {
    'missing-meta': {
      create(context) {
        return {
          Program(node) {
            context.report({ node, message: 'Missing docs' })
          }
        }
      }
    },
    'empty-meta': {
      meta: {},
      create(context) {
        return {
          Program(node) {
            context.report({ node, message: 'Missing docs' })
          }
        }
      }
    },
    'empty-docs': {
      meta: { docs: {} },
      create(context) {
        return {
          Program(node) {
            context.report({ node, message: 'Empty docs' })
          }
        }
      }
    },
    'no-description': {
      meta: { docs: { url: 'https://example.com' } },
      create(context) {
        return {
          Program(node) {
            context.report({ node, message: 'No description' })
          }
        }
      }
    },
    'no-url': {
      meta: { docs: { description: 'Description only' } },
      create(context) {
        return {
          Program(node) {
            context.report({ node, message: 'No URL' })
          }
        }
      }
    }
  }
}

export default [
  {
    plugins: {
      plugin
    },
    rules: {
      'plugin/missing-meta': 'error',
      'plugin/empty-meta': 'error',
      'plugin/empty-docs': 'error',
      'plugin/no-description': 'error',
      'plugin/no-url': 'error'
    }
  }
]
