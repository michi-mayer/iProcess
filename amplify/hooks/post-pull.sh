#!/usr/bin/env sh
 
# Make sure to have `aws-exports.mjs` so that we don't get the `SyntaxError` error from Amplify CLI (dont error if fail)
cp -f src/aws-exports.js src/aws-exports.mjs || true
cp -f src/aws-exports.js src/aws-exports.cjs || true
cp -f src/aws-exports.js src/aws-exports.ts  || true
