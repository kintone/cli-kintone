---
sidebar_position: 300
---

# Versioning Policy

This page describe how we increment the cli-kintone version.

## Basics

Our versioning refers to [Semantic Versioning](https://semver.org/).

The version number format is **x.y.z**.

## Patch update

When releasing **bugfixes or chores**, it is a **patch update**. We will increment **z** number.

e.g. bugfixes, dependencies updates, document changes, etc.

Corresponding commit types are
`fix`, `test`, `build`, `ci`, `docs`, `perf`, `refactor`, `revert`, `lint`, `style`, `debug`, and `chore`.

## Minor update

When releasing **new features**, it is a **minor update**. We will increment **y** number.

e.g. adding new command, support new format, etc.

Corresponding commit type is `feat`.

## Major update

When releasing **breaking changes**, it is a **major update**. We will increment **x** number.

e.g. changing output format, dropping platform support, etc.

Corresponding commit types are any types with `!` flag.
