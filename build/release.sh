set -e

read -p "Enter release version: " VERSION
read -p "Enter release tag (latest): " TAG

TAG=${TAG:-latest}

read -p "Releasing $VERSION for the tag '$TAG' - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # run tests
  npm test 2>/dev/null

  # build
  VERSION=$VERSION npm run build

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push
  npm publish --tag $TAG
fi
