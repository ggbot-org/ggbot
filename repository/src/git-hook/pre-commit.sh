#!/bin/bash

LINTSTAGED_FILES=`git --no-pager diff --name-status --no-color --cached | grep -E '\.(json|s?css|tsx?)$'`

if [ ! -z "$LINTSTAGED_FILES" ]; then
	npm run lint-staged
fi

MARKDOWN_FILES=`git --no-pager diff --name-status --no-color --cached | grep -E '\.md$'`

if [ ! -z "$MARKDOWN_FILES" ]; then
	npm run markdownlint
fi

TYPESCRIPT_FILES=`git --no-pager diff --name-status --no-color --cached | grep -E '\.tsx?$'`

if [ ! -z "$TYPESCRIPT_FILES" ]; then
	# Extract the workspace names from changed files,
	# then run check_types for every workspace.
	echo "$TYPESCRIPT_FILES" | cut -d / -f1 | sort | uniq | tr -d 'M' | while read WORKSPACE
		do
			npm run check_types -w $WORKSPACE
		done

	# Finally
	npm run ts-prune
fi
