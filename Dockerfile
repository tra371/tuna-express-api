FROM node:16-slim
RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

COPY ./prisma ./prisma

COPY ./.env ./

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "dev"]
