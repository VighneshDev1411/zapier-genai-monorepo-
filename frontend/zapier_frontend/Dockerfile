# Use official Node.js LTS Alpine as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port
EXPOSE 3000

# Start Next.js (Turbopack Dev Mode)
CMD ["npm", "run", "dev"]
