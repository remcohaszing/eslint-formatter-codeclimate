/**
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
  const md5 = createHash('md5')
  md5.update(filePath)
  if (message.ruleId) {
    md5.update(message.ruleId)
  }
  md5.update(message.message)

  // Create copy of hash since md5.digest() will finalize it, not allowing us to .update() again
  let md5Tmp = md5.copy()
  let hash = md5Tmp.digest('hex')

  while (hashes.has(hash)) {
    // Hash collision. This happens if we encounter the same ESLint message in one file
    // multiple times. Keep generating new hashes until we get a unique one.
    md5.update(hash)

    md5Tmp = md5.copy()
    hash = md5Tmp.digest('hex')
  }

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
 *   The ESLint messages in the form of a GitLab code quality report.
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
