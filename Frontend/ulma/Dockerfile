FROM node:16-buster AS build

# Set work directory
WORKDIR /app

# Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Copy the pre-built APK from Jenkins build into the image
COPY app-release.apk /app/build/app-release.apk
