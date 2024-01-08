#!/usr/bin/env zx
/**
 * * Checks if the changelogs are up-to-date; if not, it adds a new entry
 *
 * ? Example:
 * ?   zx add-changelog-entry.mjs
 */

import moment from 'moment'
import { echo, fs } from 'zx'

const ENGLISH_CHANGELOG_PATH = './public/data/changelog_en.json'
const GERMAN_CHANGELOG_PATH = './public/data/changelog_de.json'

const NEW_ENTRY = {
  "author": "Admin",
  "date": "01/01/2099",
  "version": "v99.1.0-0",
  "changes": [],
  "fixes": []
}

const updateChangelog = async (path, changelog) => {
  const newChangelog = [NEW_ENTRY, ...changelog]
  await fs.writeJson(path, newChangelog, { spaces: 2 })
}

const main = async () => {
  const now = moment()

  const changelog = await fs.readJson(ENGLISH_CHANGELOG_PATH)
  const latestEntryDate = moment(changelog[0]?.date, 'MM/DD/YYYY')

  if (now.isAfter(latestEntryDate)) {
    echo`The latest changelog entry is too old. Adding a new one!`
    const germanChangelog = await fs.readJson(GERMAN_CHANGELOG_PATH)

    await updateChangelog(ENGLISH_CHANGELOG_PATH, changelog)
    await updateChangelog(GERMAN_CHANGELOG_PATH, germanChangelog)
  }

}

await main()
