FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json 설치
COPY package*.json ./
RUN npm install

# 소스코드 복사
COPY . .

# 포트 지정 (예: 5000)
EXPOSE 80

# 실행 명령
CMD ["npm", "start"]
