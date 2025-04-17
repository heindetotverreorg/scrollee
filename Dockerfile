FROM --platform=linux/arm64 node:23-slim AS build_arm64

RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends

USER root

WORKDIR /app

COPY package.json .
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3001

CMD [ "node", "dist/server/index.mjs" ]
