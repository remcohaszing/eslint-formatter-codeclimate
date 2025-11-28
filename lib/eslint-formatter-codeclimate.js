/**
 * @import { Hash } from 'node:crypto'
 * @import { Issue } from 'codeclimate-types'
 * @import { ESLint, Linter, Rule } from 'eslint'
 */

import { createHash } from 'node:crypto'
import { relative } from 'node:path'

/**
 * @param {string} filePath
 *   The path to the linted file.
 * @param {Linter.LintMessage} message
 *   The ESLint report message.
 * @param {Set<string>} hashes
 *   Hashes already encountered. Used to avoid duplicate hashes
 * @returns {string}
 *   The fingerprint for the ESLint report message.
 */
function createFingerprint(filePath, message, hashes) {
  const sha256 = createHash('sha256')

  /** @type {Hash} */
  let sha256Tmp

  /** @type {string} */
  let hash

  do {
    sha256.update(filePath)
    if (message.ruleId) {
      sha256.update(message.ruleId)
    }
    sha256.update(message.message)
    sha256Tmp = sha256.copy()
    hash = sha256Tmp.digest('hex')
  } while (hashes.has(hash))

  hashes.add(hash)
  return hash
}

/**
 * Convert ESLint messages to Code Climate issues.
 *
 * @param {ESLint.LintResult[]} results
 *   The ESLint report results.
 * @param {Record<string, Rule.RuleMetaData>} rulesMeta
 *   The ESLint rule meta data.
 * @param {string} cwd
 *   The current work directory to calculate relative paths against.
 * @returns {Issue[]}
 *   The ESLint messages in the form of a CodeClimate report.
 */
export function toCodeClimate(results, rulesMeta, cwd) {
  /** @type {Issue[]} */
  const issues = []

  /** @type {Set<string>} */
  const hashes = new Set()

  for (const result of results) {
    const relativePath = relative(cwd, result.filePath)

    for (const message of result.messages) {
      /** @type {Issue} */
      const issue = {
        type: 'issue',
        categories: ['Style'],
        check_name: message.ruleId ?? '',
        description: message.message,
        severity: message.fatal ? 'critical' : message.severity === 2 ? 'major' : 'minor',
        fingerprint: createFingerprint(relativePath, message, hashes),
        location: {
          path: relativePath,
          positions: {
            begin: {
              line: message.line,
              column: message.column
            },
            end: {
              line: message.endLine ?? message.line,
              column: message.endColumn ?? message.column
            }
          }
        }
      }
      issues.push(issue)

      if (!message.ruleId) {
        continue
      }

      if (!rulesMeta[message.ruleId]) {
        continue
      }

      const { docs, type } = rulesMeta[message.ruleId]
      if (type === 'problem') {
        issue.categories.unshift('Bug Risk')
      }

      if (!docs) {
        continue
      }

      let body = docs.description || ''
      if (docs.url) {
        if (body) {
          body += '\n\n'
        }
        body += `[${message.ruleId}](${docs.url})`
      }

      if (body) {
        issue.content = { body }
      }
    }
  }
  return issues
}

/**
 * An ESLint formatter which represents ESLint results as a Code Climate report.
 *
 * For programmatic use, use {@link toCodeClimate} instead.
 *
 * @param {ESLint.LintResult[]} results
 *   The ESLint report results.
 * @param {ESLint.LintResultData} data
 *   The ESLint report result data.
 * @returns {string}
 *   The Code Climate report as a string.
 */
function formatter(results, data) {
  return `${JSON.stringify(toCodeClimate(results, data.rulesMeta, data.cwd), undefined, 2)}\n`
}

export default formatter
