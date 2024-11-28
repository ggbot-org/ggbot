#!/bin/bash

LINTSTAGED_FILES=`git --no-pager diff --name-status --no-color --cached | grep -E '\.(json|s?css|tsx?)$'`
MARKDOWN_FILES=`git --no-pager diff --name-status --no-color --cached | grep -E '\.md$'`
TYPESCRIPT_FILES=`git --no-pager diff --name-status --no-color --cached | grep -E '\.tsx?$'`

if [ ! -z "$MARKDOWN_FILES" ]; then
	npm run markdownlint
fi

if [ ! -z "$LINTSTAGED_FILES" ]; then
	npm run lint-staged
fi

if [ ! -z "$TYPESCRIPT_FILES" ]; then
	npm run check_types
fi
