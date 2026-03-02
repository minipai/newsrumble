FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

RUN mkdir -p /app/data
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npx", "react-router-serve", "./build/server/index.js"]
