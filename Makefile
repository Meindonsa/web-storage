include INFO

build :
	npm i -f && npm run build

publish :
	npm publish

build_publish : build publish