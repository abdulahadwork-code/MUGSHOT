# 1. The Foundation: Use a tiny, lightweight version of Linux with Node installed
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies inside the box
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your code into the box
COPY . .

# 5. Expose the port the app runs on
EXPOSE 5000

# 6. The command to start the engine
CMD ["node", "server.js"]