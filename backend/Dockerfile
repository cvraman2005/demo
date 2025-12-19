# Backend Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Bundle app source
COPY src ./src

# Expose backend port
EXPOSE 5000

# Use production environment
ENV NODE_ENV=production

# Start API server
CMD ["npm", "start"]
