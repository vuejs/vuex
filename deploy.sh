rm -rf _book
gitbook build
cp assets/circle.yml _book/circle.yml
cp assets/CNAME _book/CNAME
cd _book
git init
git add -A
git commit -m 'update book'
git push -f git@github-private:vuejs/vuex.git master:gh-pages
