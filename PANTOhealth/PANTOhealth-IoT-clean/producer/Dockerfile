FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
# ensure sample file exists in image at runtime
COPY --from=base /app/src/sample/x-ray.json ./dist/sample/x-ray.json
CMD ["node","dist/main.js"]
