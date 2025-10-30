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

# запуск прогарми
CMD ["npm", "run", "start:prod"]

## Етап 1: будування
## базовий образ
#FROM node:22-alpine AS builder
#
## визначення робочої папки
#WORKDIR /app
#
## завантаження залежностей
#COPY package*.json ./
#RUN npm ci
#
## збірка застосунку
#COPY . .
#RUN npm run build
#
## Етап 2: фінальний образ
## визначення базового образу
#FROM node:22-alpine AS production
#
## визначення робочої папки
#WORKDIR /app
#
## копіювання файлів залежностей з минулого етапу
## завантаженя залежностей (без інстременів розробки)
#COPY package*.json ./
#RUN npm ci --omit=dev
#
## копіювання зібраного додатку з минулого етапу
#COPY --from=builder /app/dist ./dist
#
## запуск прогарми
#CMD ["npm", "run", "start:prod"]
