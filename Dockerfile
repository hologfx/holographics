# Multistage build for Holographics

FROM node:8-jessie AS buildstep

# Change working directory
# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY package*.json ./

# Install node modules, this way we don't end up rebuilding node_modules every time
RUN npm ci --production --ignore-scripts && rm -rf /tmp/*

FROM node:8-alpine

WORKDIR ./app

COPY --from=buildstep /usr/src/app/node_modules node_modules

# Copy app directory
COPY ./dist ./dist

# Expose API port to the outside
EXPOSE 3000

CMD [ "node", "./dist/server/server.js" ]