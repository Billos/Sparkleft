# Use an official Node.js runtime as a parent image
FROM node:26.1-alpine AS base
WORKDIR /app
RUN npm install -g corepack
RUN corepack enable

FROM base AS builder
COPY . .
RUN yarn
RUN yarn build

# Stage 1: Build frontend
FROM builder AS frontend-builder
COPY . .
RUN yarn
RUN yarn build:frontend

FROM builder AS development
COPY . .
ENTRYPOINT [ "yarn", "run" ]

# Final production image
FROM base AS runtime
RUN apk update && apk add tzdata

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY .yarnrc.yml ./.yarnrc.yml
COPY tsconfig.json ./tsconfig.json
COPY .yarn ./.yarn

RUN yarn workspaces focus --production
COPY --from=builder /app/build ./build
COPY --from=builder /app/locales ./locales
COPY --from=frontend-builder /app/dist/frontend ./dist/frontend
COPY --from=builder /app/templates ./templates

EXPOSE 3000

# Use non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

ENTRYPOINT [ "npm", "run" ]
# Default to running both server and worker (backward compatible)
# Can be overridden with: docker run ... start:server or start:worker
CMD [ "start" ]