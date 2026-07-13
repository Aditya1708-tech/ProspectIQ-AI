FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/
RUN npm ci
COPY . .
RUN npm run build -w backend
EXPOSE 5000
CMD ["npm", "start", "-w", "backend"]
