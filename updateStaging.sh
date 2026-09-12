#! /bin/bash

set -eu
set -o pipefail

OS_TYPE=$(uname | awk '{print tolower($0)}')
if [ "$OS_TYPE" = "darwin" ];
then
	GNUSED=gsed
else
	GNUSED=/usr/bin/sed
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
CURRENT_BRANCH=$(git branch --show-current)

git checkout staging

printf -- "\n- Switching to branch: version-update\n"
git checkout -B version-update

printf -- "\n- Removing all files:\n"
# Remove tracked files (if any).
git -C "${SCRIPT_DIR}" rm -f '*' || true

# Remove untracked files.
git -C "${SCRIPT_DIR}" clean -fdx

# Should be no files left.
printf -- "\n- Files left in directory:\n"
ls -a "${SCRIPT_DIR}"

printf -- "\n- Copying new files:\n"
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/.gitignore
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/.prettierrc
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/angular.json
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/karma.conf.js
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/LICENSE
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/ng-package.json
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/package.json
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/README.md
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/tsconfig.lib.json
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/tsconfig.lib.prod.json
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/tsconfig.spec.json
git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/src

git checkout "$CURRENT_BRANCH" "$SCRIPT_DIR"/.github/ISSUE_TEMPLATE_PUBLIC
git mv "$SCRIPT_DIR"/.github/ISSUE_TEMPLATE_PUBLIC "$SCRIPT_DIR"/.github/ISSUE_TEMPLATE


printf -- "\n- Removing internal only files:\n"
rm -vrf  "$SCRIPT_DIR"/src/stories


printf -- "\n- Sanitizing from -Internal.\n"
while IFS= read -r f; do
	echo "$f"
	$GNUSED -i 's/-Internal//ig' "$f"
done < <(grep -rlIi --exclude-dir=.git -- '-Internal' .)


printf -- "\n- Sanitizing from __SIGNALOID_INTERNAL_ONLY__.\n"
while IFS= read -r f; do
	echo "$f"
	$GNUSED -i '/START __SIGNALOID_INTERNAL_ONLY__/,/END __SIGNALOID_INTERNAL_ONLY__/d' "$f"
done < <(grep -rlI --exclude-dir=.git 'START __SIGNALOID_INTERNAL_ONLY__' .)


printf -- "\n- Staging all files:\n"
git add -v .

printf -- "\n- Removing all untracked files:\n"
git clean -fdx


printf -- "\n- Checking for use of Internal:\n"
if grep -R --exclude-dir=.git -e '-Internal' .; then
	printf -- "ERROR: use of -Internal leaked into the public tree (see matches above). Aborting.\n"
	exit 1
else
	printf -- "No Internal files found\n"
fi

printf -- "\n- Checking for leaked internal-only content:\n"
if grep -R -I -i -n -E --exclude-dir=.git --exclude-dir=__pycache__ '__SIGNALOID_INTERNAL_ONLY__' .; then
	printf -- "ERROR: private content leaked into the public tree (see matches above). Aborting.\n"
	exit 1
else
	printf -- "No private content found\n"
fi

printf -- "\n\n- Finished successfully.\n"
