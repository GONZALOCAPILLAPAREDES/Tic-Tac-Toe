FROM node:18-alpine

RUN mkdir -p /usr/react-app

WORKDIR /usr/react-app

# copying package.json
COPY package.json .

RUN npm install .

COPY . .

RUN npm run build . 

