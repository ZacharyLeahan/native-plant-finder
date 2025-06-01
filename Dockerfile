FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose ports
EXPOSE ${PORT:-3000} ${BACKEND_PORT:-3001}

# Start the Express server (serves both API and React build)
CMD ["npm", "run", "start:server"] 