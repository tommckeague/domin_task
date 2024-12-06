# Base image for Node.js
FROM node:18-alpine AS dev

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the development server port
EXPOSE 3000

# Set environment variables for development
ENV NODE_ENV development
ENV HOSTNAME "0.0.0.0"
ENV PORT 3000

# Run the development server
CMD ["npm", "run", "dev"]
