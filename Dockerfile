FROM jestrr/mods:no-java

WORKDIR /home/app
ADD . /home/app

RUN npm install

RUN npm run release
