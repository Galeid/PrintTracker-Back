FROM node:20 AS development

# Specify Working directory inside container
WORKDIR /usr/backend/src/app

# Copy package-lock.json & package.json from host to inside container working directory
COPY package*.json ./

# Install deps inside container
RUN npm install

RUN npm rebuild bcrypt --build-from-source

COPY . .

RUN npm run build

EXPOSE 3000
