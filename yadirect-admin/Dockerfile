FROM node:18.18.2

RUN mkdir /app
WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install --no-cache --frozen-lockfile

COPY ./ /app
ENV NODE_ENV production

RUN yarn build

CMD yarn run start
