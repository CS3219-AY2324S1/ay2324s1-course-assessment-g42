FROM node:16-alpine
WORKDIR '/app'
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8030

CMD ["node", "index.js"]