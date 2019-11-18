#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")/.."; pwd)"
CODENAME="$(basename "${PROJECT_DIR}")"

export PROJECT_DIR

cd "${PROJECT_DIR}"
./node_modules/.bin/babel ./src/App.js -o /dev/null
