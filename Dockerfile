FROM node:9-alpine

WORKDIR /app

ADD . /app

# Install everything (and clean up afterwards)
RUN npm i -g npm && npm i -g yarn \
  && yarn \
  && yarn clean \
  && yarn build

CMD yarn server

EXPOSE 3000