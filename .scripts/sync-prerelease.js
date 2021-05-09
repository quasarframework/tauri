#!/usr/bin/env node
// Copyright 2019-2021 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

/*
This script is solely intended to be run as part of the `covector version` step to
keep the `tauri-release` crate version without the `beta` or `beta-rc` suffix.
*/

const { readFileSync, writeFileSync } = require("fs")

const packageNickname = process.argv[2]
const bump = process.argv[3]

let manifestPath
let dependencyManifestPaths
let changelogPath

if (packageNickname === 'tauri-runtime') {
  manifestPath = '../../core/tauri-runtime/Cargo.toml'
  dependencyManifestPaths = ['../../core/tauri/Cargo.toml', '../../core/tauri-wry/Cargo.toml']
  changelogPath = '../../core/tauri-runtime/CHANGELOG.md'
} else if (packageNickname === 'tauri-wry') {
  manifestPath = '../../core/tauri-wry/Cargo.toml'
  dependencyManifestPaths = ['../../core/tauri/Cargo.toml']
  changelogPath = '../../core/tauri-wry/CHANGELOG.md'
} else {
  throw new Error(`Unexpected package ${packageNickname}`)
}

let manifest = readFileSync(manifestPath, "utf-8")
manifest = manifest.replace(/version = "(\d+\.\d+\.\d+)-[^0-9\.]+\.0"/, 'version = "$1"')
writeFileSync(manifestPath, manifest)

let changelog = readFileSync(changelogPath, "utf-8")
changelog = changelog.replace(/(\d+\.\d+\.\d+)-[^0-9\.]+\.0/, '$1')
writeFileSync(changelogPath, changelog)

for (const dependencyManifestPath of dependencyManifestPaths) {
  let dependencyManifest = readFileSync(dependencyManifestPath, "utf-8")
  dependencyManifest = dependencyManifest.replace(/tauri-runtime = { version = "(\d+\.\d+\.\d+)-[^0-9\.]+\.0"/, 'tauri-runtime = { version = "$1"')
  writeFileSync(dependencyManifestPath, dependencyManifest)
}
