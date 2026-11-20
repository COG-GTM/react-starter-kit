#!/usr/bin/env sh
# Regenerates architecture.png and architecture.svg from architecture.dot.
# Requires Graphviz (e.g. `sudo apt-get install -y graphviz fonts-dejavu` or `brew install graphviz`).
set -e
cd "$(dirname "$0")"
dot -Tpng -Gdpi=110 architecture.dot -o architecture.png
dot -Tsvg architecture.dot -o architecture.svg
