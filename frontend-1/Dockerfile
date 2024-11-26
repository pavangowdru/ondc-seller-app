# Use node base image
FROM node:14 as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
#RUN npm run build
CMD ["npm", "run", "build"]

# Expose port 3000
#EXPOSE 3000
# Serve the build directory
#CMD ["npx", "serve", "-s", "build"]

#stage-2

# Use Nginx to serve the frontend build
FROM nginx:alpine

COPY --from=builder /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

#start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]