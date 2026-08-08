# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Builder stage: install all dependencies and compile TypeScript.
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install
# Once you create a package-lock.json by running npm install locally, switch to:
# COPY package.json package-lock.json ./
# RUN npm ci

# Copy the source code into the container and compile TypeScript.
COPY . .
RUN npm run build


# Deps stage: install production dependencies only.
FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev
# Once you create a package-lock.json by running npm install locally, switch to:
# COPY package.json package-lock.json ./
# RUN npm ci --omit=dev


# Runner stage: minimal runtime image with compiled app and production deps.
FROM node:24-alpine AS runner

ENV PATH=/app/node_modules/.bin:$PATH

WORKDIR /app

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["node", "dist/index.js"]
