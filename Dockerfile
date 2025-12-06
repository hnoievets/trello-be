# Етап 1: будування
# базовий образ
FROM node:22-alpine AS builder

# визначення робочої папки
WORKDIR /app

# завантаження залежностей
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# збірка застосунку
COPY . .
RUN npm run build

# Етап 2: фінальний образ
# визначення базового образу
FROM node:22-alpine AS production

# визначення робочої папки
WORKDIR /app

# копіювання файлів залежностей
# завантаженя залежностей (без інструменів розробки)
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# копіювання зібраного додатку з минулого етапу
COPY --from=builder /app/dist ./dist

# копіювання необхіного для роботи додатку
COPY .sequelizerc db-config.cjs ./
COPY locales ./locales
COPY migrations ./migrations

# копіювання та надання прав вхідному скрипту
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# оголошення точки входу програми
ENTRYPOINT ["./entrypoint.sh"]
