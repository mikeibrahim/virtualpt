bd: build2 deploy
build: build2
run: start

start:
	npm start

deploy:
	firebase deploy --only hosting

build2:
	npm run build

install: 
	npm install

clean: 
	rm -rf node_modules
	