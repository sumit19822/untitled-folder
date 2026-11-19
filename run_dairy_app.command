#!/bin/bash
# हिमांशु डेयरी फ़ार्म ऐप को सीधे ब्राउज़र में खोलने की स्क्रिप्ट
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
open "$DIR/index.html"
