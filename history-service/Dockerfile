FROM node:16-alpine
WORKDIR '/app'
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5004

CMD ["node", "index.js"]