FROM node:22.16-alpine

WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build

CMD npm run migrate && npm run start:prod
