# Use an official Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the root directory
COPY package*.json  ./

#ENV key=value
# Install dependencies
RUN npm install

# Copy the backend code into the container
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
