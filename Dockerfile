# Stage 1: Install dependencies and build the app
FROM node:18-alpine AS builder
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Create production image
FROM node:18-alpine
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app /app

# Install only production dependencies (optional)
# RUN npm ci --omit=dev

# Expose the default Next.js port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
