FROM node:12.16.0

ARG PM2_KEY="rwi3z65zgdool0r r7r4yqh99zmgydm"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g pm2
RUN pm2 link $PM2_KEY
CMD [ "npm", "start" ]