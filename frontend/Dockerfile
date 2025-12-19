# Frontend Dockerfile
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Build static assets
COPY . .
RUN npm run build

# Serve built assets with a lightweight server
FROM nginx:1.27-alpine AS runtime

# Copy build output to nginx html dir
COPY --from=build /app/build /usr/share/nginx/html

# Expose frontend port
EXPOSE 80

# Default nginx start command
CMD ["nginx", "-g", "daemon off;"]
