# Define the image you want to build from.
# In this case, we are using the latest LTS (long term support) version of Node.
FROM node:18
# Create app directory to hold application code inside the image.
# The image comes with Node.js and NPM already installed.
# We just need to install the rest of our dependencies.
# Copy package.json and package-lock.json to the app directory on the image.
COPY package*.json ./
# Install dependencies.
RUN npm install
# Uncomment the following line if you are building code for production.
# RUN npm ci --omit=dev
# Bundle the app's source code inside the Docker image.
COPY . .
# Expose port 5000 so it can be mapped by Docker daemon.
EXPOSE 5000

# Define the command to run your app using CMD which defines your runtime.
CMD [ "node", "index.js" ]
