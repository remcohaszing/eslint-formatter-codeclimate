/**
 * @import { Issue } from 'codeclimate-types'
 */

import assert from 'node:assert/strict'
import { join } from 'node:path'
import { describe, test } from 'node:test'

import { ESLint } from 'eslint'
import { toCodeClimate } from 'eslint-formatter-codeclimate'
import { assertEqual } from 'snapshot-fixtures'

describe('toCodeClimate', () => {
  test('generate a CodeClimate report', async () => {
    const cwd = join(import.meta.dirname, 'fixtures/issues')
    const eslint = new ESLint({ cwd })
    const results = await eslint.lintFiles([])
    const rulesMeta = eslint.getRulesMetaForResults(results)
    const issues = toCodeClimate(results, rulesMeta, cwd)
    assert.deepEqual(issues, [
      {
        categories: ['Style'],
        check_name: '',
        description: 'Parsing error: Unexpected token',
        fingerprint: 'cbf6619c6f5a4b997a6c4b9eab150ad2',
        location: {
          positions: { begin: { line: 2, column: 1 }, end: { line: 2, column: 1 } },
          path: 'fatal.js'
        },
        severity: 'critical',
        type: 'issue'
      },
      {
        categories: ['Bug Risk', 'Style'],
        check_name: 'no-debugger',
        content: {
          body: 'Disallow the use of `debugger`\n\n[no-debugger](https://eslint.org/docs/latest/rules/no-debugger)'
        },
        description: "Unexpected 'debugger' statement.",
        fingerprint: '3669b857c8f6f91c9abb11871eb81ad1',
        location: {
          positions: { begin: { line: 1, column: 1 }, end: { line: 1, column: 9 } },
          path: 'fixture.js'
        },
        severity: 'minor',
        type: 'issue'
      },
      {
        categories: ['Style'],
        check_name: 'no-console',
        content: {
          body: 'Disallow the use of `console`\n\n[no-console](https://eslint.org/docs/latest/rules/no-console)'
        },
        description: 'Unexpected console statement.',
        fingerprint: 'ad51b34553a9ef5712d8cf58956dc994',
        location: {
          positions: { begin: { line: 2, column: 1 }, end: { line: 2, column: 12 } },
          path: 'fixture.js'
        },
        severity: 'major',
        type: 'issue'
      }
    ])
  })

  test('write a CodeClimate report with CI config path', async () => {
    const cwd = join(import.meta.dirname, 'fixtures/issues')
    const eslint = new ESLint({ cwd })
    const results = await eslint.lintFiles([])
    const rulesMeta = eslint.getRulesMetaForResults(results)
    const issues = toCodeClimate(results, rulesMeta, cwd)
    assert.deepEqual(issues, [
      {
        categories: ['Style'],
        check_name: '',
        description: 'Parsing error: Unexpected token',
        fingerprint: 'cbf6619c6f5a4b997a6c4b9eab150ad2',
        location: {
          positions: { begin: { line: 2, column: 1 }, end: { line: 2, column: 1 } },
          path: 'fatal.js'
        },
        severity: 'critical',
        type: 'issue'
      },
      {
        categories: ['Bug Risk', 'Style'],
        check_name: 'no-debugger',
        content: {
          body: 'Disallow the use of `debugger`\n\n[no-debugger](https://eslint.org/docs/latest/rules/no-debugger)'
        },
        description: "Unexpected 'debugger' statement.",
        fingerprint: '3669b857c8f6f91c9abb11871eb81ad1',
        location: {
          positions: { begin: { line: 1, column: 1 }, end: { line: 1, column: 9 } },
          path: 'fixture.js'
        },
        severity: 'minor',
        type: 'issue'
      },
      {
        categories: ['Style'],
        check_name: 'no-console',
        content: {
          body: 'Disallow the use of `console`\n\n[no-console](https://eslint.org/docs/latest/rules/no-console)'
        },
        description: 'Unexpected console statement.',
        fingerprint: 'ad51b34553a9ef5712d8cf58956dc994',
        location: {
          positions: { begin: { line: 2, column: 1 }, end: { line: 2, column: 12 } },
          path: 'fixture.js'
        },
        severity: 'major',
        type: 'issue'
      }
    ])
  })

  test('generate unique hashes for duplicate messages', async () => {
    const cwd = join(import.meta.dirname, 'fixtures/duplicates')
    const eslint = new ESLint({ cwd })
    const results = await eslint.lintFiles([])
    const rulesMeta = eslint.getRulesMetaForResults(results)
    const issues = toCodeClimate([...results, ...results], rulesMeta, cwd)
    assert.deepEqual(issues, [
      {
        categories: ['Bug Risk', 'Style'],
        check_name: 'no-debugger',
        content: {
          body: 'Disallow the use of `debugger`\n\n[no-debugger](https://eslint.org/docs/latest/rules/no-debugger)'
        },
        description: "Unexpected 'debugger' statement.",
        fingerprint: '3669b857c8f6f91c9abb11871eb81ad1',
        location: {
          positions: { begin: { line: 1, column: 1 }, end: { line: 1, column: 9 } },
          path: 'fixture.js'
        },
        severity: 'major',
        type: 'issue'
      },
      {
        categories: ['Bug Risk', 'Style'],
        check_name: 'no-debugger',
        content: {
          body: 'Disallow the use of `debugger`\n\n[no-debugger](https://eslint.org/docs/latest/rules/no-debugger)'
        },
        description: "Unexpected 'debugger' statement.",
        fingerprint: 'b5b0e1d51da3906f565fcbcfb5964346',
        location: {
          positions: { begin: { line: 1, column: 1 }, end: { line: 1, column: 9 } },
          path: 'fixture.js'
        },
        severity: 'major',
        type: 'issue'
      }
    ])
  })

  test('don’t fail if a rule id is null', async () => {
    const cwd = join(import.meta.dirname, 'fixtures/unused-disable')
    const eslint = new ESLint({ cwd })
    const results = await eslint.lintFiles([])
    const rulesMeta = eslint.getRulesMetaForResults(results)
    const issues = toCodeClimate(results, rulesMeta, cwd)
    assert.deepEqual(issues, [
      {
        categories: ['Style'],
        check_name: '',
        description:
          "Unused eslint-disable directive (no problems were reported from 'no-debugger').",
        fingerprint: '0d88946a05ccd7175f2711bd7f8821ee',
        location: {
          positions: { begin: { line: 1, column: 1 }, end: { line: 1, column: 1 } },
          path: 'fixture.js'
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })

  test('don’t fail on partial rule metadata', async () => {
    const cwd = join(import.meta.dirname, 'fixtures/missing-meta')
    const eslint = new ESLint({ cwd })
    const results = await eslint.lintFiles([])
    const rulesMeta = eslint.getRulesMetaForResults(results)
    const issues = toCodeClimate(results, rulesMeta, cwd)
    assert.deepEqual(issues, [
      {
        categories: ['Style'],
        check_name: 'plugin/missing-meta',
        description: 'Missing docs',
        fingerprint: 'edf9d1d54d9c89dd1412ef11a7413b45',
        location: {
          positions: { begin: { line: 8, column: 1 }, end: { line: 75, column: 2 } },
          path: 'eslint.config.js'
        },
        severity: 'major',
        type: 'issue'
      },
      {
        categories: ['Style'],
        check_name: 'plugin/empty-meta',
        description: 'Missing docs',
        fingerprint: 'c67e7c9c1a844b65d30710d9d9278d40',
        location: {
          positions: { begin: { line: 8, column: 1 }, end: { line: 75, column: 2 } },
          path: 'eslint.config.js'
        },
        severity: 'major',
        type: 'issue'
      },
      {
        categories: ['Style'],
        check_name: 'plugin/empty-docs',
        description: 'Empty docs',
        fingerprint: '5ac7fe0fe3025663d064826d49e27164',
        location: {
          positions: { begin: { line: 8, column: 1 }, end: { line: 75, column: 2 } },
          path: 'eslint.config.js'
        },
        severity: 'major',
        type: 'issue'
      },
      {
        categories: ['Style'],
        check_name: 'plugin/no-description',
        content: { body: '[plugin/no-description](https://example.com)' },
        description: 'No description',
        fingerprint: '256e5d936b053b630b4993f7dd8bedd6',
        location: {
          positions: { begin: { line: 8, column: 1 }, end: { line: 75, column: 2 } },
          path: 'eslint.config.js'
        },
        severity: 'major',
        type: 'issue'
      },
      {
        categories: ['Style'],
        check_name: 'plugin/no-url',
        content: { body: 'Description only' },
        description: 'No URL',
        fingerprint: '5a89671407235a680cac73999a076960',
        location: {
          positions: { begin: { line: 8, column: 1 }, end: { line: 75, column: 2 } },
          path: 'eslint.config.js'
        },
        severity: 'major',
        type: 'issue'
      }
    ])
  })
})

describe('formatter', () => {
  test('generate a CodeClimate report as a string', async () => {
    const cwd = join(import.meta.dirname, 'fixtures/issues')
    const eslint = new ESLint({ cwd })
    const results = await eslint.lintFiles([])
    const formatter = await eslint.loadFormatter('codeclimate')
    const report = await formatter.format(results)
    assertEqual(
      report,
      `[
  {
    "type": "issue",
    "categories": [
      "Style"
    ],
    "check_name": "",
    "description": "Parsing error: Unexpected token",
    "severity": "critical",
    "fingerprint": "cbf6619c6f5a4b997a6c4b9eab150ad2",
    "location": {
      "path": "fatal.js",
      "positions": {
        "begin": {
          "line": 2,
          "column": 1
        },
        "end": {
          "line": 2,
          "column": 1
        }
      }
    }
  },
  {
    "type": "issue",
    "categories": [
      "Bug Risk",
      "Style"
    ],
    "check_name": "no-debugger",
    "description": "Unexpected 'debugger' statement.",
    "severity": "minor",
    "fingerprint": "3669b857c8f6f91c9abb11871eb81ad1",
    "location": {
      "path": "fixture.js",
      "positions": {
        "begin": {
          "line": 1,
          "column": 1
        },
        "end": {
          "line": 1,
          "column": 9
        }
      }
    },
    "content": {
      "body": "Disallow the use of \`debugger\`\\n\\n[no-debugger](https://eslint.org/docs/latest/rules/no-debugger)"
    }
  },
  {
    "type": "issue",
    "categories": [
      "Style"
    ],
    "check_name": "no-console",
    "description": "Unexpected console statement.",
    "severity": "major",
    "fingerprint": "ad51b34553a9ef5712d8cf58956dc994",
    "location": {
      "path": "fixture.js",
      "positions": {
        "begin": {
          "line": 2,
          "column": 1
        },
        "end": {
          "line": 2,
          "column": 12
        }
      }
    },
    "content": {
      "body": "Disallow the use of \`console\`\\n\\n[no-console](https://eslint.org/docs/latest/rules/no-console)"
    }
  }
]
`
    )
  })
})
