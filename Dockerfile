FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 포트 지정 (예: 8080)
EXPOSE 80

CMD ["npm", "start"]