FROM node:9-alpine

# Install everything (and clean up afterwards)
RUN apk add --no-cache --virtual .gyp \
    autoconf \
    automake \
    g++ \
    libpng-dev \
    libtool \
    make \
    nasm \
    python \
    git \
  && npm i -g npm

WORKDIR /app

ADD ./package*.json .

RUN npm install --build-from-source=bcrypt \
    && apk del .gyp
# RUN npm i -g yarn && yarn
	# && yarn add express morgan -S \
	# && yarn add babel-cli \
	# 	babel-preset-es2015 \
	# 	rimraf \
	# 	-D

ADD . .

CMD yarn dev

EXPOSE 3001