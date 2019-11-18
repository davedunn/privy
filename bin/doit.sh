#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")/.."; pwd)"
CODENAME="$(basename "${PROJECT_DIR}")"

export PROJECT_DIR

SERVER_LOGGING_WINDOW_ID=$(osascript -e 'tell application "Terminal"' -e 'activate' -e "do shell script \"echo \" & id of (first window whose tty of tab 1 is \"$(tty)\")" -e 'end tell')
osascript -e 'tell application "Terminal"' -e "set frontmost of window id ${SERVER_LOGGING_WINDOW_ID} to true" -e 'end tell'
CLIENT_BUILDER_WINDOW_ID=$(osascript -e 'tell application "Terminal"' -e 'activate' -e 'tell application "System Events" to keystroke "t" using command down' -e 'do shell script "echo " & id of front window' -e 'end tell')
osascript -e 'tell application "Terminal"' -e "set frontmost of window id ${SERVER_LOGGING_WINDOW_ID} to true" -e 'end tell'

# osascript -e 'tell application "Terminal"' -e "do script \"cd \\\"${PROJECT_DIR}/server/\\\" && npm start\" in window id ${SERVER_LOGGING_WINDOW_ID}" -e 'end tell'
osascript -e 'tell application "Terminal"' -e "do script \"cd \\\"${PROJECT_DIR}/client/\\\" && npm start\" in window id ${CLIENT_BUILDER_WINDOW_ID}" -e 'end tell'

on_exit () {
    # osascript -e "tell application \"Terminal\" to close window id $SERVER_LOGGING_WINDOW_ID"
    osascript -e "tell application \"Terminal\" to close window id $CLIENT_BUILDER_WINDOW_ID"
}
trap "on_exit" EXIT
cd "${PROJECT_DIR}/server/" && npm start
# cd "${PROJECT_DIR}/client/" && npm start
