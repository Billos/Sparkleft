# Use an official Node.js runtime as a parent image
FROM node:22.14.0-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn 
RUN yarn build

# Final production image
FROM node:22.14.0-alpine AS runtime
WORKDIR /app

RUN apk add tzdata

COPY ./package.json ./package.json
RUN yarn install --frozen-lockfile --production && yarn cache clean
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/templates ./templates

EXPOSE 3000

ENTRYPOINT [ "npm", "run" ]
# Default to running both server and worker (backward compatible)
# Can be overridden with: docker run ... start:server or start:worker
CMD [ "start" ]