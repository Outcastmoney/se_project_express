# ---- Build stage (not compiling TS here, but kept for pattern) ----
FROM node:22-alpine AS base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Bundle app source
COPY . .

# Expose port
ENV PORT=3001
EXPOSE 3001

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "app.js"]
