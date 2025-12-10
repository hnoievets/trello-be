# базовий образ
FROM node:22

# визначення робочої папки
WORKDIR /app

# завантаження залежностей
COPY package*.json ./
RUN npm ci

# збірка застосунку
COPY . .
RUN npm run build

# копіювання та надання прав вхідному скрипту
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# оголошення точки входу програми
ENTRYPOINT ["./entrypoint.sh"]
