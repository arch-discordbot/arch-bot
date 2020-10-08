# Build stage
FROM node:14-alpine AS build-stage

WORKDIR /bot/source

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --slient && yarn cache clean

COPY tsconfig.json .
COPY ./src/ ./src/

RUN yarn build

# Production stage
FROM node:14-alpine

WORKDIR /bot/

COPY --from=build-stage /bot/source/build ./build
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production && yarn cache clean

CMD yarn start
