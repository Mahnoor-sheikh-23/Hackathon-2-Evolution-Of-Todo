# Simple single-stage build for the frontend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for the build)
RUN npm ci

# Copy application code
COPY . .

# Build the application for production
RUN npm run build

# Create a non-root user for security
RUN addgroup -g 1001 nodejs &&\
    adduser -S nextjs -u 1001 -G nodejs

# Change ownership of app files to the new user
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]