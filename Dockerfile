# Use official Node.js image as base
FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app



# Copy all source files
COPY . .

# Install dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]