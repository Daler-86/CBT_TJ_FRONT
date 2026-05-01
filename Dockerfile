# ---------- Stage 1: Build Angular ----------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx ng build --configuration production


# ---------- Stage 2: Nginx ----------
FROM nginx:alpine

# ⚠️ ВАЖНО: Angular кладёт в dist/<project-name>
COPY --from=build /app/dist/cbt-web-site/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
