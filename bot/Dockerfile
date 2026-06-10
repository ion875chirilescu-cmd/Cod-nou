# Imagine pentru rularea SELECT BOT pe orice serviciu de găzduire.
FROM node:22-alpine

WORKDIR /app

# Instalează doar dependențele de runtime (mai rapid, mai mic).
COPY package*.json ./
RUN npm install --omit=dev

# Copiază codul botului.
COPY . .

# Token-ul și cheia se setează ca variabile de mediu pe serviciul de găzduire,
# NU în imagine. Botul folosește long polling — nu are nevoie de port.
CMD ["npm", "start"]
