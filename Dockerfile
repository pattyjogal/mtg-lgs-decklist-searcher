# Use an official Node.js image as the build environment
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy only package files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Use Nginx as the production image
FROM node:alpine

# Copy the built app from the build environment to the Nginx web root
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# Expose port 3000 
EXPOSE 3000

# Command to run Nginx
CMD ["npm", "start"]