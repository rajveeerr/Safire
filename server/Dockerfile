FROM ghcr.io/puppeteer/puppeteer:24.2.1

USER pptruser

WORKDIR /home/pptruser/app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["node", "src/index.js"]