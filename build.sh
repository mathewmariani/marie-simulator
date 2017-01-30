#!/bin/bash
set -e

# build our app
# we do this so I can have a clean repo on gh-pages
# and to make the minify process smoother
gulp build
