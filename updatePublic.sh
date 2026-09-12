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
PUBLIC_REPO_URL="git@github.com:signaloid/Signaloid-DesignSystem.git"
TARGET="../Signaloid-DesignSystem"

# Check if the directory exists
if [ -d "$TARGET/.git" ]; then
	printf -- "- Directory $TARGET already exists and is a git repository. Pulling the latest changes from the main branch.\n"
	git -C "${TARGET}" checkout main
	git -C "${TARGET}" reset --hard HEAD
	git -C "${TARGET}" pull origin main
else
	printf -- "- Directory $TARGET does not exist. Cloning the repository.\n"
	git clone "$PUBLIC_REPO_URL" "$TARGET"
fi

printf -- "\n- Removing all files:\n"
# Remove tracked files (if any).
git -C "${TARGET}" rm -f '*' || true

# Remove untracked files.
git -C "${TARGET}" clean -fdx

# Should be no files left.
printf -- "\n- Files left in directory:\n"
ls -a "${TARGET}"


printf -- "\n- Checkout to staging:\n"
git checkout staging

printf -- "\n- Copying new files:\n"
rsync -av --exclude='.git' "$SCRIPT_DIR"/ "$TARGET"


# Switch to public repo folder
cd "$TARGET"

printf -- "\n- Staging all files:\n"
git add -v .

printf -- "\n- Removing all untracked files:\n"
git clean -fdx

printf -- "\n- Switching to branch: version-update\n"
git checkout -B version-update


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
