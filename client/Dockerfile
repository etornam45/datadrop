# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY client/ .

RUN npm run build

# Expose the port the app runs on
EXPOSE 4173

# Start the application
CMD ["npm", "run", "preview"]