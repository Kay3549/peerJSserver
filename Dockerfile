# Use a multi-stage build for smaller images
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (improves caching)
COPY package*.json ./

# Install dependencies (only production dependencies for final image)
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Build the application (if needed)
RUN npm run build

# Final stage - production-ready image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built application and installed dependencies from the builder stage
COPY --from=builder /app /app

# Set environment variable for production
ENV NODE_ENV=production

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
