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
        fingerprint: '3d67384197ac8bfd7dcb9d4d81eab675ecd459ed8bae5ec4e681a1bceef48788',
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
        fingerprint: 'daff1f5f24794988561d3c2df5e0242800e6a7d8874bffaf612ada36fe6490de',
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
        fingerprint: 'd2ea3e82aa0f9fdfac7138e742d22645a7062163362d03358dcab94a1b71d8cf',
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
        fingerprint: '3d67384197ac8bfd7dcb9d4d81eab675ecd459ed8bae5ec4e681a1bceef48788',
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
        fingerprint: 'daff1f5f24794988561d3c2df5e0242800e6a7d8874bffaf612ada36fe6490de',
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
        fingerprint: 'd2ea3e82aa0f9fdfac7138e742d22645a7062163362d03358dcab94a1b71d8cf',
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
        fingerprint: 'daff1f5f24794988561d3c2df5e0242800e6a7d8874bffaf612ada36fe6490de',
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
        fingerprint: '9df139c44bfb4ea6eb0cc4082588c23e76716823d2dd567673f90d1077c5d4a0',
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
        fingerprint: 'a547cb8bca980b99e4c80050268b9423b9cc10277d6e84fbea47a1e421315287',
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
        fingerprint: '7db55200708454f50b03e92f4a1586c753f87b40f635997ee6b9a34b4aa76247',
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
        fingerprint: '7315c2bbb5f1c3ae82f633c47780a91b5f5394dab9bb648fd6a5b06f7d2f6824',
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
        fingerprint: '6d435ef65c2398cf029a5081734a7677ee9a62aeb6701406a08eb2f8ee32d927',
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
        fingerprint: 'c98c3855c9d302774f717192d0e7c36a418850367164d3f6322d3ef267ae62a4',
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
        fingerprint: '65c7816ad5a8e04459afa119a7ecd98e64eef677fc1b4b5e27f1a28e52b59a73',
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
    "fingerprint": "3d67384197ac8bfd7dcb9d4d81eab675ecd459ed8bae5ec4e681a1bceef48788",
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
    "fingerprint": "daff1f5f24794988561d3c2df5e0242800e6a7d8874bffaf612ada36fe6490de",
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
    "fingerprint": "d2ea3e82aa0f9fdfac7138e742d22645a7062163362d03358dcab94a1b71d8cf",
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
