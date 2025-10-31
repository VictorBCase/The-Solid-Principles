# ===== Stage 1: Build React app =====
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the app source and build
COPY . .
RUN npm run build

# ===== Stage 2: Serve built files using 'serve' =====
FROM node:20-alpine

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy the build output from the first stage
COPY --from=build /app/dist ./dist

# Expose the port serve will use
EXPOSE 3000

# Run the static server
CMD ["serve", "-s", "dist", "-l", "3000"]
