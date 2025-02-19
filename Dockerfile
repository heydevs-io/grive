FROM node:20-bullseye-slim AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

#####

FROM node:20-bullseye-slim AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json /usr/src/app/package-lock.json ./
COPY --from=builder /usr/src/app/dist ./dist

RUN npm install --production

ENTRYPOINT ["node", "dist/src/main.js"]
