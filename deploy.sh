#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

# set up some variables
SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"
GITHUB_REF="github.com/mathewmariani/marie-simulator.git"
NAME="Mat Mariani"
EMAIL="someone.mariani@gmail.com"
BUILD_DIR="build"

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "This commit was made against the ${TRAVIS_BRANCH} and not the ${SOURCE_BRANCH}!"
    exit 0
fi

# change to Jekyll build directory
cd ${BUILD_DIR}

# create git, and commit
git init
git config user.name ${NAME}
git config user.email ${EMAIL}
git add .
git commit -m "Deployed to ${TARGET_BRANCH} - Travis-CI"

# push quietly not to leak info
git push --force --quiet "https://${GITHUB_TOKEN}@${GITHUB_REF}" ${SOURCE_BRANCH}:${TARGET_BRANCH} > /dev/null 2>&1
