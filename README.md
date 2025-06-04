# eslint-formatter-codeclimate

[![github actions](https://github.com/remcohaszing/eslint-formatter-codeclimate/actions/workflows/ci.yaml/badge.svg)](https://github.com/remcohaszing/eslint-formatter-codeclimate/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/remcohaszing/eslint-formatter-codeclimate/branch/main/graph/badge.svg)](https://codecov.io/gh/remcohaszing/eslint-formatter-codeclimate)
[![npm version](https://img.shields.io/npm/v/eslint-formatter-codeclimate)](https://www.npmjs.com/package/eslint-formatter-codeclimate)
[![npm downloads](https://img.shields.io/npm/dm/eslint-formatter-codeclimate)](https://www.npmjs.com/package/eslint-formatter-codeclimate)

Format [ESLint](https://eslint.org) results as a
[Code Climate](https://github.com/codeclimate/platform/blob/master/spec/analyzers/SPEC.md) report.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Command Line](#command-line)
- [API](#api)
  - [`toCodeClimate(results, rulesMeta, cwd)`](#tocodeclimateresults-rulesmeta-cwd)
  - [`formatter()`](#formatter)
- [Compatibility](#compatibility)
- [License](#license)

## Installation

```sh
npm install eslint-formatter-codeclimate
```

## Usage

### Command Line

Using the ESLint CLI:

```sh
eslint --format codeclimate
```

Programmatically using Node.js:

```js
import { ESLint } from 'eslint'
import { toCodeClimate } from 'eslint-formatter-codeclimate'

const cwd = process.cwd()
const eslint = new ESLint({ cwd })
const results = await eslint.lintFiles([])
const rulesMeta = eslint.getRulesMetaForResults(results)
const issues = toCodeClimate(results, rulesMeta, cwd)

console.log(issues)
```

## API

### `toCodeClimate(results, rulesMeta, cwd)`

Convert ESLint messages to CodeClimate issues.

#### Arguments

- `results` (`ESLint.LintResult[]`) — The ESLint report results.
- `rulesMeta` (`Record<string, Rule.RuleMetaData>`) — The ESLint rule meta data.
- `cwd` (`string`) — The current work directory to calculate relative paths against.

#### Returns

The ESLint messages in the form of a GitLab code quality report.

### `formatter()`

The default export is an ESLint formatter which represents ESLint results as a CodeClimate report.

#### Arguments

- `results` (`ESLint.LintResult[]`) — The ESLint report results.
- `data` (`ESLint.LintResultData`) — The ESLint report result data.

#### Returns

The Code Climate report as a string.

## Compatibility

This project is compatible with Node.js 20 or greater.

## License

[MIT](LICENSE.md) © [Remco Haszing](https://github.com/remcohaszing)
