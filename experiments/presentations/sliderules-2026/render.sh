#!/bin/sh
# Renders slides.md to slides.pdf with Marp (npm i --prefix ~/.local/opt/marp @marp-team/marp-cli).
cd "$(dirname "$0")"
CHROME_NO_SANDBOX=1 CHROME_PATH="${CHROME_PATH:-$HOME/.cache/ms-playwright/chromium-1148/chrome-linux/chrome}" \
  "${MARP:-$HOME/.local/opt/marp/node_modules/.bin/marp}" --no-stdin --allow-local-files --html --pdf slides.md -o slides.pdf
