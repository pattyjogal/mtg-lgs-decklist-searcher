# Use an official Node.js image as the build environment
FROM node:18 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy only package files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Use Nginx as the production image
FROM nginx:alpine

# Copy the built app from the build environment to the Nginx web root
COPY --from=build /usr/src/app/out /usr/share/nginx/html

# Expose port 5000 
EXPOSE 5000

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]