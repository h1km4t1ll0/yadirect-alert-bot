FROM node:18.18.2

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y tzdata
RUN cp /usr/share/zoneinfo/Asia/Dubai /etc/localtime && echo "Asia/Dubai" > /etc/timezone
RUN dpkg-reconfigure --frontend noninteractive tzdata
#RUN apt-get update && \
#    apt-get install -y nano openssl curl
#
#RUN curl -o- -L https://yarnpkg.com/install.sh | sh
RUN mkdir /app
WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install --no-cache --frozen-lockfile

COPY ./ /app
ENV NODE_ENV production

RUN yarn build

RUN yarn cache clean

CMD yarn cs:import -y && yarn run start
