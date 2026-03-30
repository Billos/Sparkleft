# Use an official Node.js runtime as a parent image
FROM node:22.14.0-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn 
RUN yarn build
# Copy the SDK package.json into the build output so the runtime symlink resolves correctly
RUN cp src/sdk/firefly/package.json build/sdk/firefly/package.json

# Final production image
FROM node:22.14.0-alpine AS runtime
WORKDIR /app

RUN apk add tzdata

COPY ./package.json ./package.json
RUN yarn install --frozen-lockfile --production && yarn cache clean
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/templates ./templates
# Wire @firefly to the compiled SDK so node can resolve the package name at runtime
RUN mkdir -p node_modules && ln -sf /app/build/sdk/firefly /app/node_modules/@firefly

EXPOSE 3000

ENTRYPOINT [ "npm", "run" ]
# Default to running both server and worker (backward compatible)
# Can be overridden with: docker run ... start:server or start:worker
CMD [ "start" ]